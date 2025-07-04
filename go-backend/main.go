package main

import (
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"os"

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
	err := godotenv.Load()

	if err != nil {
		log.Fatal("error loading .env file")
	}

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	app.Post("/login", func(c *fiber.Ctx) error {
		user := new(User)

		if err := c.BodyParser(user); err != nil {
			return err
		}

		userId, err := getUserId(user.Username)

		if err != nil {
			return c.Status(fiber.StatusBadRequest).SendString(err.Error())
		}

		user.UserID = userId

		return c.JSON(user)
	})

	app.Get("/videos", func(c *fiber.Ctx) error {
		client := &http.Client{}
		req, err := http.NewRequest("GET", "https://api.mux.com/video/v1/assets", nil)

		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}

		tokenId := os.Getenv("MUX_TOKEN_ID")
		tokenSecret := os.Getenv("MUX_TOKEN_SECRET")

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

func getUserId(username string) (int, error) {
	if username == "" {
		return 0, errors.New("username should not be empty")
	}

	usernameLength := len(username)
	userId := usernameLength

	for i := range usernameLength {
		userId += int(username[i])
	}

	return userId, nil
}
