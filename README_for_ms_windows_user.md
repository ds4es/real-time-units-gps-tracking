# For a Microsoft Windows development environment

## Install prerequisites
1. Install Git: https://git-scm.com/download/win
2. Install JDK: https://www.oracle.com/java/technologies/javase-jdk8-downloads.html (under C:\Users\your_user_name)
3. Create a new user environment variable (System properties>Environment variables..) named `JAVA_HOME` with the value: `C:\Users\your_user_name\jdk-xx.x.x`
4. Restart your computer

From the `Git Bash` console

#### [Optional] Behind a proxy, set up git proxy configuration
```bash
git config --global http.proxy http://user:pass@proxy.server.com:8080
git config --global https.proxy https://user:pass@proxy.server.com:8080
```
You also might need to disable Git SSL verification
```bash
git config --global http.sslVerify false
```
Please be advised disabling SSL verification globally might be considered a security risk and should be implemented only temporary. (see https://confluence.atlassian.com/fishkb/unable-to-clone-git-repository-due-to-self-signed-certificate-376838977.html)

Clone this repo:
```bash
git clone https://github.com/ds4es/real-time-units-gps-tracking
```

## Start Zookeeper and Kafka

Under a first `Git Bash` console
```
~/kafka/bin/windows/zookeeper-server-start.bat ~/kafka/config/zookeeper.properties
```

Under another `Git Bash` console
```
~/kafka/bin/windows/kafka-server-start.bat ~/kafka/config/server.properties
```

#### Install Python dependencies

For Anaconda users (under Anaconda Prompt) setup a new environment and load it
```bash
conda create -n real-time-units-gps-tracking python
activate real-time-units-gps-tracking
```

Install requirements
```bash
cd path/to/real-time-units-gps-tracking
conda install --file requirements.txt
```

Start a signal provider from one Anaconda Prompt
```bash
python kafka_stream_producer_london_alpha.py
```

[Optional] Start another signal provider under another Anaconda Prompt
```bash
cd path/to/real-time-units-gps-tracking
activate real-time-units-gps-tracking
python kafka_stream_producer_london_beta.py
```

Under a third Anaconda prompt, launch the app
```bash
cd path/to/real-time-units-gps-tracking
activate real-time-units-gps-tracking
python app_london.py
```

The app should be accessible through a browser at: http://127.0.0.1:5001
