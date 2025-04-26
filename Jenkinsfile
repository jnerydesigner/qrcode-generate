pipeline {
    agent any

    tools {
        nodejs 'NodeJS_22' // Garante uso do Node 22 para todo o pipeline
    }

    environment {
        FRONTEND_PATH = '/var/lib/jenkins/workspace/QrCodeGenerate/frontend'
        BACKEND_PATH = '/var/lib/jenkins/workspace/QrCodeGenerate/backend'
        IMAGE_NAME = 'jandernery/qrcode-generate'
        TAG_VERSION = 'v2'
        CONTAINER_NAME = 'qrcode-generate'
    }

    stages {

        stage("Verificar versões") {
            steps {
                sh 'node -v'
                sh 'yarn -v'
            }
        }

        stage("Instalar dependências Frontend") {
            steps {
                dir("${env.FRONTEND_PATH}") {
                    sh 'yarn install'
                }
            }
        }

        stage("Build Docker Backend") {
            steps {
                script {
                    docker.build("${IMAGE_NAME}:${TAG_VERSION}", "${env.BACKEND_PATH}")
                    docker.build("${IMAGE_NAME}:latest", "${env.BACKEND_PATH}")
                }
            }
        }

        stage("Push Docker Image") {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
                        docker.image("${IMAGE_NAME}:${TAG_VERSION}").push()
                    }
                }
            }
        }

        stage("Run Backend com Docker") {
            steps {
                script {
                    sh "docker rm -f ${CONTAINER_NAME} || true"
                    sh """
                        docker run -d \\
                        --name ${CONTAINER_NAME} \\
                        --env-file=${BACKEND_PATH}/.env \\
                        -p 4545:4545 \\
                        ${IMAGE_NAME}:latest
                    """
                }
            }
        }

        stage("Build e Deploy Frontend via PM2") {
            steps {
                script {
                    sh """
                        ssh deploy-server '
                        export NVM_DIR="$HOME/.nvm"
                        source "$NVM_DIR/nvm.sh"
                        nvm use v22.15.0

                        # Verifica versão do node
                        node -v
                        yarn -v

                        # Vai pro projeto
                        cd /var/lib/jenkins/workspace/QrCodeGenerate/frontend

                        # Instala dependências e builda
                        yarn install
                        yarn build

                        # PM2 deve estar instalado com "npm install -g pm2" previamente
                        pm2 update
                        pm2 start ecosystem.config.cjs || pm2 restart ecosystem.config.cjs
'
                    """
                }
            }
        }
    }

    post {
        success {
            echo "========pipeline executed successfully ========"
        }
        failure {
            echo "========pipeline execution failed========"
        }
    }
}
