angular.module \plotDB, <[backend ui.codemirror ngDraggable]>
  ..service 'plNotify', <[$rootScope $timeout]> ++ ($rootScope, $timeout) -> @ <<< do
    queue: []
    send: (type, message) -> 
      @queue.push node = {type, message}
      $timeout (~> @queue.splice @queue.indexOf(node), 1), 2900
