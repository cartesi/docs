#!/bin/bash
if [ -z "$GID" -o -z "$UID" -o -z "$USER" -o -z "$GROUP" ]; then
    echo Running as root
    exec "$@"
else
  if [ ! $(getent group $GROUP) -a ! $(getent group $GID) ]; then
    echo Creating group $GROUP with id $GID
    groupadd -g $GID $GROUP
  else
    echo Group name $GROUP or id $GID already exist
  fi
  if [ ! $(getent passwd $USER) -a ! $(getent passwd $UID) ]; then
    echo Creating user $USER with id $UID
    useradd -u $UID -g $GID $USER
  else
    echo User name $USER or id $UID already exist
  fi
  export HOME=/home/$USER
  mkdir -p $HOME
  chown $USER:$GROUP $HOME
  exec /usr/local/bin/su-exec $USER "$@"
fi
