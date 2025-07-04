FROM golang:1.24-alpine

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY *.go ./

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o /rum-video-streaming-backend

EXPOSE 3000

CMD ["/rum-video-streaming-backend"]