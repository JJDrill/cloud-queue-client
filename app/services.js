angular.module('DataNexus')
  .factory('MetricService', MetricService)
  .factory('DatastoreServices', DatastoreServices)
  .factory('ProjectServices', ProjectServices);

var serverUrl = 'http://localhost:3000';
// var serverUrl = 'https://cloudqueue.herokuapp.com';

ProjectServices.$inject = ['$http']
function ProjectServices ($http) {
  return {

    Get_Projects: function(){
      return $http.get(serverUrl + '/api/projects').then(function(projects){
        return projects.data;
      })
    },

    Get_Project_Datastores: function(){
      return $http.get(serverUrl + '/api/stores').then(function(datastores){
        return datastores.data;
      })
    },

    Add_New_Project: function(newProjectName){
      var body = {name: newProjectName}
      return $http.post(serverUrl + '/api/projects/add', body).then(function(result){
        return result;
      })
    },

    Delete_Project: function(projectName){
      return $http.delete(serverUrl + '/api/projects/' + projectName).then(function(result){
        return result;
      })
    }

  }
}


DatastoreServices.$inject = ['$http']
function DatastoreServices ($http) {
  return {

    getDatastoreDetailList: function(project_id){
      return $http.get(serverUrl + '/api/stores/' + project_id)
    },

    Add_Datastore: function(projectId, newDatastoreName){
      var body = {
        project_group_id: projectId,
        store_type: 'Queue',
        data_store_name: newDatastoreName
      }

      return $http.post(serverUrl + '/api/stores', body).then(function(result){
        return result;
      })
    },

    Delete_Datastore: function(datastoreID){
      return $http.delete(serverUrl + '/api/stores/' + datastoreID).then(function(result){
        return result;
      })
    },
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
