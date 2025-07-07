package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"

	log "github.com/sirupsen/logrus"

	"github.com/DataDog/dd-trace-go/v2/ddtrace/tracer"
	"github.com/joho/godotenv"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type User struct {
	Username string `json:"username"`
	UserID   int    `json:"userId"`
}

type JSONResponse struct {
	Data json.RawMessage `json:"data"`
}

func main() {
	log.SetFormatter(&log.JSONFormatter{})
	godotenv.Load()

	tokenId := os.Getenv("MUX_TOKEN_ID")
	tokenSecret := os.Getenv("MUX_TOKEN_SECRET")

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173, http://localhost:8000",
		AllowHeaders: "*",
	}))

	app.Post("/login", func(c *fiber.Ctx) error {
		ctx := c.Context()
		span, spanFound := tracer.SpanFromContext(ctx)

		user := new(User)

		if err := c.BodyParser(user); err != nil {
			return err
		}

		log.WithContext(ctx).Info(fmt.Sprintf("%s is trying to log in", user.Username))

		userId, err := getUserId(ctx, user.Username)

		if err != nil {
			return c.Status(fiber.StatusBadRequest).SendString(err.Error())
		}

		user.UserID = userId

		if spanFound {
			tracer.SetUser(
				span,
				strconv.Itoa(user.UserID),
				tracer.WithUserLogin(user.Username),
			)
		}

		log.WithContext(ctx).Info(fmt.Sprintf("%s logged in successfully", user.Username))

		return c.JSON(user)
	})

	app.Get("/videos", func(c *fiber.Ctx) error {
		ctx := c.Context()
		log.WithContext(ctx).Info("Fetching video list from Mux")

		client := &http.Client{}
		req, err := http.NewRequest("GET", "https://api.mux.com/video/v1/assets", nil)

		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}

		req.SetBasicAuth(tokenId, tokenSecret)

		resp, err := client.Do(req)

		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}

		body, err := io.ReadAll(resp.Body)

		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}

		jsonResponse := &JSONResponse{
			Data: body,
		}

		return c.JSON(jsonResponse.Data)
	})

	app.Listen(":3000")
}

func getUserId(ctx context.Context, username string) (int, error) {
	parenSpan, parentSpanFound := tracer.SpanFromContext(ctx)
	span := &tracer.Span{}

	if parentSpanFound {
		span = parenSpan.StartChild("getUserId")
		defer span.Finish()
	}

	if username == "" {
		errMsg := "username should not be empty"
		err := errors.New(errMsg)
		if parentSpanFound {
			span.Finish(tracer.WithError(err))
		}
		log.WithContext(ctx).Error(errMsg)
		return 0, err
	}

	usernameLength := len(username)
	userId := usernameLength

	for i := range usernameLength {
		userId += int(username[i])
	}

	if parentSpanFound {
		span.SetTag("userId", strconv.Itoa(userId))
	}

	return userId, nil
}
