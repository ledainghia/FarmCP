pipeline {
    agent any

    stages {
        stage('Packaging') {
            steps {
                    sh 'docker build --pull --rm -f Dockerfile -t nongtraionlinefe:latest .'
            }
        }

       
        stage('Deploy') {
            steps {
                echo 'Deploying and cleaning'
                sh 'docker container stop nongtraionlinefe || echo "this container does not exist"'
                sh 'docker container run -d --name nongtraionlinefe -p 5052:3000 nongtraionlinefe'
                sh 'echo y | docker system prune'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}