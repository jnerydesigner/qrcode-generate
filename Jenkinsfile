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
        APPLICATION_NAME = 'generated-qrcode'
    }

    stages {
        stage("Verificar Instalações") {
            steps {
                sh 'which node'
                sh 'which yarn'
                sh 'which pm2'
                sh '/var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/node -v'
            }
        }

        stage('Deploy com PM2') {
            steps {
                script {
                    sh """
                        ssh deploy-server '
                            # Configura o PATH para usar o Node.js 22 e o Yarn corretos
                            export PATH=/var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin:$PATH

                            # Confirma a versão correta do Node e Yarn
                            node -v
                            yarn -v


                            # Vai ate a a pasta
                            cd /var/lib/jenkins/workspace/QrCodeGenerate/frontend

                            # Instala dependências com o Node correto
                            yarn install

                            # Builda o projeto
                            yarn build

                            # Reinicia PM2
                            pm2 delete generated-qrcode || true
                            pm2 start ecosystem.config.cjs --update-env || pm2 restart ecosystem.config.cjs
'

                    """
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
