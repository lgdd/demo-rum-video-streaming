#!/usr/bin/env bash

# Install requirements
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update -y
sudo apt-get install -y apt-transport-https ca-certificates git curl jq software-properties-common docker-ce docker-ce-cli containerd.io

# Add ubuntu user to docker group (so we don't need sudo for docker commands after reboot/re-login)
sudo usermod -aG docker ubuntu
# Enable Docker to start on boot
sudo systemctl enable docker

# Install Docker Compose
DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | jq -r ".tag_name" | cut -c2-)
sudo curl -L "https://github.com/docker/compose/releases/download/$${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone Storedog
APP_DIR=/home/ubuntu/rum_video_streaming
git clone https://github.com/lgdd/demo-rum-video-streaming.git --depth=1 $${APP_DIR}

cd $${APP_DIR}
cd react-ts-frontend
cp .env.example .env.production

PUBLIC_HOSTNAME=$(ec2metadata --public-hostname)

# Update Datadog environment variables
echo "export PUBLIC_HOSTNAME=\"$${PUBLIC_HOSTNAME}\"" >> /etc/environment
echo "export DD_API_KEY=\"${dd_api_key}\"" >> /etc/environment
echo "export DD_APP_KEY=\"${dd_app_key}\"" >> /etc/environment
echo "export DD_SITE=\"${dd_site}\"" >> /etc/environment
echo "export MUX_TOKEN_ID=\"${mux_token_id}\"" >> /etc/environment
echo "export MUX_TOKEN_SECRET=\"${mux_token_secret}\"" >> /etc/environment
echo "export RUM_VIDEO_STREAMING_CORS_ALLOW_ORIGINS=\"http://$${PUBLIC_HOSTNAME}:8000\"" >> /etc/environment

sed -i 's/^VITE_APP_BACKEND_HOST=.*/VITE_APP_BACKEND_HOST='$PUBLIC_HOSTNAME'/' .env.production
sed -i 's/^VITE_APP_DD_APP_ID=.*/VITE_APP_DD_APP_ID=${dd_rum_video_streaming_rum_app_id}/' .env.production
sed -i 's/^VITE_APP_DD_CLIENT_TOKEN=.*/VITE_APP_DD_CLIENT_TOKEN=${dd_rum_video_streaming_rum_client_token}/' .env.production

sudo chown -R ubuntu:ubuntu $${APP_DIR}

sudo docker compose up -d --build