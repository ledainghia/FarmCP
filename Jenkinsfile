pipeline {
    agent any

    stages {
        stage('Packaging') {
            steps {
                    sh 'docker build --pull --rm -f Dockerfile -t nongtraionlinefe:latest .'
            }
        }

        stage('Push to DockerHub') {
            steps {
                withDockerRegistry(credentialsId: 'dockerhub', url: 'https://index.docker.io/v1/') {
                    sh 'docker tag nongtraionlinefe:latest chalsfptu/nongtraionlinefe:latest'
                    sh 'docker push chalsfptu/nongtraionlinefe:latest'
                }
            }
        }

        stage('Deploy') {
            steps {
                
                    echo 'Deploying and cleaning'
                    sh 'docker container stop nongtraionlinefe || echo "this container does not exist"'
                    sh 'echo y | docker system prune'
                    sh '''
                        docker container run -d --name nongtraionlinefe -p 5052:3000 chalsfptu/nongtraionlinefe
                    '''
                }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
