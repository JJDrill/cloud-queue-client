angular.module('DataNexus')
  .factory('AuthServices', AuthServices)
  .factory('MetricService', MetricService)
  .factory('DatastoreServices', DatastoreServices)
  .factory('AlertServices', AlertServices)
  .factory('ProjectServices', ProjectServices);

function getAPIHost() {
  if(window.location.hostname == '127.0.0.1') {
    return 'http://localhost:3000';
  } else {
    return 'https://cloudqueue.herokuapp.com';
  }
}

AuthServices.$inject = ['$http']
function AuthServices ($http) {
  return {

    Signup: function(user_name, password, phone_number, receiveSMS){
      var body = {
        name: user_name,
        password: password,
        phone_number: phone_number,
        receiveSMS: receiveSMS
      }
      return $http.post(getAPIHost() + '/api/auth/signup', body).then(function(result){
        return result;
      })
    },

    Login: function(username, password){
      var body = {
        username: username,
        password: password
      }
      return $http.post(getAPIHost() + '/api/auth/login', body).then(function(result){
        return result
      }).catch(function(err){
        return err
      })
    },

    Logout: function(){
      return $http.get(getAPIHost() + '/api/auth/logout').then(function(result){
        return result;
      })
    },
  }
}

ProjectServices.$inject = ['$http']
function ProjectServices ($http) {
  return {

    Get_Projects: function(){
      if (Is_Authenticated()) {
        return $http.get(getAPIHost() + '/api/projects').then(function(projects){
          return projects.data;
        })
      } else {

      }
    },

    Get_All_Datastores: function(){
      return $http.get(getAPIHost() + '/api/stores').then(function(datastores){
        return datastores.data;
      })
    },

    Get_Project_Datastores: function(project_id){
      return $http.get(getAPIHost() + '/api/stores/' + project_id).then(function(datastores){
        return datastores.data;
      })
    },

    Add_New_Project: function(newProjectName){
      var body = {name: newProjectName}
      return $http.post(getAPIHost() + '/api/projects/add', body).then(function(result){
        return result;
      })
    },

    Delete_Project: function(projectName){
      return $http.delete(getAPIHost() + '/api/projects/' + projectName).then(function(result){
        return result;
      })
    }

  }
}


DatastoreServices.$inject = ['$http']
function DatastoreServices ($http) {
  return {

    Get_Datastore_List: function(){
      return $http.get(getAPIHost() + '/api/stores')
    },

    getDatastoreDetailList: function(project_id){
      return $http.get(getAPIHost() + '/api/stores/' + project_id)
    },

    Add_Datastore: function(projectId, newDatastoreName){
      var body = {
        project_group_id: projectId,
        store_type: 'Queue',
        data_store_name: newDatastoreName
      }

      return $http.post(getAPIHost() + '/api/stores', body).then(function(result){
        return $http.post(getAPIHost() + '/api/queues/' + result.data[0] + '/register/').then(function(result){
          return result;
        })
      })

    },

    Delete_Datastore: function(datastoreID){
      return $http.delete(getAPIHost() + '/api/stores/' + datastoreID).then(function(result){
        return result;
      })
    },
  }
}


AlertServices.$inject = ['$http']
function AlertServices ($http) {
  return {

    Get_Alerts_By_Project: function(project_id){
      return $http.get(getAPIHost() + '/api/alerts/byproject/' + project_id).then(function(result){
        return result.data;
      })
    },

    Get_Alert_Comparer_List: function(){
      return $http.get(getAPIHost() + '/api/alerts/comparers/list').then(function(result){
        return result.data;
      })
    },

    Add_Alert: function(alert_info){
      var body = {
        store_id: alert_info.Datastore_ID,
        name: alert_info.Alert_Name,
        comparer: alert_info.Alert_Comparer,
        value: alert_info.Alert_Value
      }
      return $http.post(getAPIHost() + '/api/alerts/', body).then(function(result){
        return result.data;
      })
    },

    Delete_Alert: function(alert_id){
      return $http.delete(getAPIHost() + '/api/alerts/' + alert_id).then(function(result){
        return result.data;
      })
    }

  }
}


MetricService.$inject = ['$stateParams']
function MetricService ($stateParams) {
  var callback
  var socket = io(getAPIHost() + '/');

  socket.on('metrics', function (data) {
    callback (data)
  })
  return {
    on: function (cb) {
      callback = cb
    }
  }
}
