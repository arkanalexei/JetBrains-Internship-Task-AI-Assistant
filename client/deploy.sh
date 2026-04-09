#!/bin/bash

echo "Running yarn build..."
if yarn build; then
    echo "Build succeeded."

    if [ -d "/var/www/chatbot-fe/dist" ]; then
        echo "Removing existing /var/www/chatbot-fe/dist directory..."
        sudo rm -rf /var/www/chatbot-fe/dist
    fi

    echo "Copying new build to /var/www/chatbot-fe..."
    sudo cp -R /home/ec2-user/chatbot-fe/dist /var/www/chatbot-fe/

    echo "Deployment completed successfully."
else
    echo "Build failed. Aborting deployment."
    exit 1
fi