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

        stage("Verificar Instalações") {
            steps {
                sh 'which node'
                sh 'which yarn'
                sh 'which pm2'
            }
        }

        stage("Verificar versões e PM2 Status") {
            steps {
                sh '/var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/node -v'
                sh '/var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/yarn -v'
                sh '/var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/pm2 status'
            }
        }

        stage("Instalar dependências Frontend") {
            steps {
                dir("${env.FRONTEND_PATH}") {
                    sh '''
                        sudo chown -R jenkins:jenkins /var/lib/jenkins/workspace/QrCodeGenerate
                        /var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/yarn install
                        /var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/yarn build
                    '''
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

//         stage("Build e Deploy Frontend via PM2") {
//             steps {
//                 script {
//                     sh """

//                         # Vai pro projeto
//                         cd /var/lib/jenkins/workspace/QrCodeGenerate/frontend

//                         # Instala dependências e builda
//                         /var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/yarn install
//                         /var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/yarn build

//                         # PM2 deve estar instalado com "npm install -g pm2" previamente
//                         pm2 update
//                         pm2 start ecosystem.config.cjs || pm2 restart ecosystem.config.cjs
// '
//                     """
//                 }
//             }
//         }
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
