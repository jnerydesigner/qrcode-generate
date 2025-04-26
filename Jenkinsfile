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
                            # Navega para o diretório do projeto
                            cd /var/lib/jenkins/workspace/QrCodeGenerate/frontend


                            /var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/node -v

                            ls -la

                            cat ecosystem.config.cjs


                            # Instala dependências
                            yarn install
                            yarn build

                            var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/pm2 delete ${env.APPLICATION_NAME}

                            # Inicia ou reinicia o processo PM2
                            /var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/pm2 start ecosystem.config.cjs --update-env || /var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/pm2 restart ecosystem.config.cjs

                        '
                    """
                }
            }
        }

        // stage("Instalar dependências Frontend") {
        //     steps {
        //         dir("${env.FRONTEND_PATH}") {
        //             sh '''
        //                 sudo chown -R jenkins:jenkins /var/lib/jenkins/workspace/QrCodeGenerate
        //                 /var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/yarn install
        //                 /var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/yarn build
        //                 /var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/pm2 start ecosystem.config.cjs || /var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/pm2 restart ecosystem.config.cjs
        //             '''
        //         }
        //     }   
        // }

        // stage("Instalar dependências Frontend") {
        //     steps {
        //         dir("${env.FRONTEND_PATH}") {
        //             sh '''
        //                 sudo chown -R jenkins:jenkins /var/lib/jenkins/workspace/QrCodeGenerate
        //                 /var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/yarn install
        //                 /var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/yarn build
        //                 /var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/pm2 update
        //                 /var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/pm2 start ecosystem.config.cjs || /var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/pm2 restart ecosystem.config.cjs
        //             '''
        //         }
        //     }
        // }


        // stage("Build Docker Backend") {
        //     steps {
        //         script {
        //             docker.build("${IMAGE_NAME}:${TAG_VERSION}", "${env.BACKEND_PATH}")
        //             docker.build("${IMAGE_NAME}:latest", "${env.BACKEND_PATH}")
        //         }
        //     }
        // }

        // stage("Push Docker Image") {
        //     steps {
        //         script {
        //             docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
        //                 docker.image("${IMAGE_NAME}:${TAG_VERSION}").push()
        //             }
        //         }
        //     }
        // }

        // stage("Run Backend com Docker") {
        //     steps {
        //         script {
        //             sh "docker rm -f ${CONTAINER_NAME} || true"
        //             sh """
        //                 docker run -d \\
        //                 --name ${CONTAINER_NAME} \\
        //                 --env-file=${BACKEND_PATH}/.env \\
        //                 -p 4545:4545 \\
        //                 ${IMAGE_NAME}:latest
        //             """
        //         }
        //     }
        // }

        // stage('Deploy com PM2') {
        //     steps {
        //         script {
        //             sh """
        //             ssh deploy-server '
        //                 # Navega para o diretório do projeto
        //                 cd /var/lib/jenkins/workspace/QrCodeGenerate/frontend


        //                 # Instala dependências
        //                 /var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/yarn install
        //                 /var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/yarn build

        //                 # Inicia ou reinicia o processo PM2
        //                 /var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/pm2 start ecosystem.config.cjs --update-env || /var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/pm2 restart ecosystem.config.cjs
        //             '
        //             """
        //         }
        //     }
        // }
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
