rm website -rf
node ./predeploy.js
sudo docker build -t dev-frontend-platform .
sudo docker tag dev-frontend-platform:latest 684187527326.dkr.ecr.us-east-1.amazonaws.com/dev-front-end-platform:latest
sudo docker push 684187527326.dkr.ecr.us-east-1.amazonaws.com/dev-front-end-platform:latest