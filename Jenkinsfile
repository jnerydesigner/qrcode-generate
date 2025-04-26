pipeline{
    agent any
     tools {
        nodejs 'NodeJS_22'
    }
    stages{
        stage("Navegação ate a Pasta do Projeto"){
            steps{
                script {
                    sh "cd /var/lib/jenkins/workspace/BackendQRCodeGenerate/backend"
                }
            }
        }
        stage("Build Image Docker"){
            steps {
                script {
                    def imageName = "jandernery/qrcode-generate:v2"
                    def imageNameLatest = "jandernery/qrcode-generate:latest"

                    docker.build(imageName, '/var/lib/jenkins/workspace/BackendQRCodeGenerate/backend')
                    docker.build(imageNameLatest, '/var/lib/jenkins/workspace/BackendQRCodeGenerate/backend')
                }
            }
        }
         stage("Docker Push"){
            steps{
                script {
                    def imageName = 'jandernery/qrcode-generate:v2'
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
                        docker.image(imageName).push()
                    }
                }
            }
        }
        stage("Docker Run Application"){
            steps{
                script {
                    def imageNameLatest = "jandernery/qrcode-generate:latest"
                    def containerName = "qrcode-generate" 
                    
                    sh "docker rm -f ${containerName} || true" 


                    sh '''#!/bin/bash
                        docker run -d \
                        --name ${containerName} \
                        --env-file /var/lib/jenkins/workspace/QrCodeGenerate/backend/.env \
                        -p 4545:4545 \
                        ${imageNameLatest}
                    '''
                }
            }
        }
        stage("Checar a Versão do NodeJS"){
            steps {
                script {
                    def nodeVersion = sh(script: 'node -v', returnStdout: true).trim()
                    echo "NodeJS version: ${nodeVersion}"
                }
            }
        }
         stage("Checar a Versão do Yarn"){
            steps {
                script {
                    def yarnVersion = sh(script: 'yarn -v', returnStdout: true).trim()
                    echo "Yarn version: ${yarnVersion}"
                }
            }
        }
         stage("Instalar as Dependencias do projeto"){
            steps {
                script {
                    sh "cd /var/lib/jenkins/workspace/FrontendQRCodeGenerate/frontend && yarn install"
                }
            }
        }
        stage("Verificar Ambiente e Suas Dependencias"){
            steps {
                 script {
                    sh 'echo $PATH' // Verifica o PATH
                    sh 'which node' // Verifica o caminho do node
                    sh 'which pm2' // Verifica o caminho do pm2
                    sh 'which npm' // Verifica o caminho do npm
                    sh 'which yarn' // Verifica o caminho do npm
                }
            }
        }
        stage("Deploy Aplicação PM2"){
            steps {
                script {
                    sh """
                        ssh deploy-server '
                            # Navegar ate a pasta do projeto
                            cd /var/lib/jenkins/workspace/FrontendQRCodeGenerate/frontend

                            # Instalar as Dependencias
                            /var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/yarn install

                            # Faz o build
                            /var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/yarn build

                            # Faz o start e restart do PM2
                            /var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/pm2 start ecosystem.config.cjs || /var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS_22/bin/pm2 restart ecosystem.config.cjs
                        '
                    """
                }
            }
        }
    }
    post{
        always{
            echo "========always========"
        }
        success{
            echo "========pipeline executed successfully ========"
        }
        failure{
            echo "========pipeline execution failed========"
        }
    }
}