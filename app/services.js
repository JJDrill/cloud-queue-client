angular.module('DataNexus')
  .factory('AuthServices', AuthServices)
  .factory('MetricService', MetricService)
  .factory('DatastoreServices', DatastoreServices)
  .factory('ProjectServices', ProjectServices);

var serverUrl = 'http://localhost:3000';
// var serverUrl = 'https://cloudqueue.herokuapp.com';

// function getAPIHost() {
//   if(window.location.hostname == 'localhost') {
//     return 'http://localhost:3000';
//   } else {
//     return 'https://powerful-wave-3355.herokuapp.com';
//   }
// }

AuthServices.$inject = ['$http']
function AuthServices ($http) {
  return {

    Signup: function(user_name, password){
      var body = {
        name: user_name,
        password: password
      }
      return $http.post(serverUrl + '/api/auth/signup', body).then(function(result){
        console.log("services result: ", result);
        return result;
      })
    },

    Login: function(username, password){
      var body = {
        username: username,
        password: password
      }
      // return $http.post(serverUrl + '/api/auth/login', body).then(function(result){
      //   return result;
      // })
    },

    Logout: function(){
      return $http.get(serverUrl + '/api/auth/logout').then(function(result){
        return result;
      })
    },
  }
}

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

    Get_Datastore_List: function(){
      return $http.get(serverUrl + '/api/stores')
    },

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
