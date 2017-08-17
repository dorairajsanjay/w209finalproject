# to be executed using the below command
# nohup sh restart_server.sh &

### NOTE THAT THIS SCRIPT DOES NOT WORK ON MAC OS ###

# script to restart node process in the event of a failure
le [ 1 ]
do
    sleep 1
    echo "checking if Server is up..."
    up=`ps -ef |grep Server | wc -l`
    if [ $up -ne 4 ]
    then
	echo "Process crashed...attempting restart"
	nohup node Server.js  &
    fi
done
