angular.module('DataNexus')
  .factory('MetricService', MetricService)
  .factory('ProjectServices', ProjectServices);

// var serverUrl = 'http://localhost:8080';
var serverUrl = 'https://cloudqueue.herokuapp.com';

ProjectServices.$inject = ['$http']

function ProjectServices ($http) {
  return {

    Get_Projects: function(){
      return $http.get(serverUrl+'/api/projects').then(function(projects){
        return projects.data;
      })
    },

    Get_Project_Datastores: function(){
      return $http.get(serverUrl+'/api/stores').then(function(datastores){
        return datastores.data;
      })
    }

  }
}

MetricService.$inject = ['$stateParams']

function MetricService ($stateParams) {
  var callbacks = []
  var socket = io(serverUrl+'/');

  socket.on('metrics', function (data) {
    callbacks.forEach(function (callback) {
      // console.log(data);
      callback(data)
    })
    // console.log('disconnecting...');
    // socket.disconnect();
    // socket.io.close();
  })
  return {
    on: function (callback) {
      callbacks.push(callback)
    }
  }

}
