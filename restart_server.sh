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
