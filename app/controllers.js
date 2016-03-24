angular.module('DataNexus')
  .controller('SignupController', SignupController)
  .controller('LoginController', LoginController)
  .controller('ConfigureController', ConfigureController)
  .controller('ConfigureControllerProjects', ConfigureControllerProjects)
  .controller('ConfigureControllerList', ConfigureControllerList)
  // .controller('ConfigureControllerDetails', ConfigureControllerDetails)
  .controller('MonitorController', MonitorController)
  .controller('AlertsController', AlertsController)
  .controller('alertListController', alertListController);


function Is_Authenticated(){
  if (localStorage.token === "" || localStorage.token === undefined) {
    return false;
  } else {
    return true;
  }
}

LoginController.$inject = ['$rootScope', '$scope', '$location', 'AuthServices'];
function LoginController($rootScope, $scope, $location, AuthServices) {

  $scope.Login = function(){
    AuthServices.Login($scope.username, $scope.password).then(function(result){
      if (result.status != 200) {
        // TODO: throw an UI alert here.
      } else {
        localStorage.token = result.data.token
        $location.path('/monitor/');
      }
    })
  }

  $scope.Logout = function(){
    localStorage.token = ""
    $location.path('/');
  }

  $scope.Clear_Alerts = function(){
    $rootScope.alerts = []
  }

  $scope.isActive = function (viewLocation) {
    if ( $location.path().indexOf( viewLocation ) > -1 ) {
      return true
    } else {
      return false
    }
  };

}


SignupController.$inject = ['$scope', '$location', 'AuthServices'];
function SignupController($scope, $location, AuthServices) {

  $scope.Signup = function(){
    AuthServices.Signup($scope.newUsername, $scope.newPassword, $scope.newPhoneNumber, $scope.receiveSMS)
    .then(function(result){
      $location.path('/');
    })
  }

}


ConfigureController.$inject = ['$scope', '$stateParams', 'ProjectServices', 'DatastoreServices'];
function ConfigureController($scope, $stateParams, ProjectServices, DatastoreServices) {
  $("[name='my-checkbox']").bootstrapSwitch();

  ProjectServices.Get_Projects().then(function(results){
    $scope.projects = results;
  })
}


ConfigureControllerProjects.$inject = ['$scope', '$stateParams', 'ProjectServices'];
function ConfigureControllerProjects($scope, $stateParams, ProjectServices) {

  $scope.add_New_Project = function(){
    ProjectServices.Add_New_Project($scope.newProjectName).then(function(result){
      if (result.data === "Success") {
        window.location.reload();
      }
    })
  };

  $scope.delete_Project = function(project_name){
    ProjectServices.Delete_Project(project_name).then(function(){
      window.location.reload();
    })
  };

}


ConfigureControllerList.$inject = ['$scope', '$stateParams', 'DatastoreServices'];
function ConfigureControllerList($scope, $stateParams, DatastoreServices) {
  $scope.showNewStoreForm = false;

  DatastoreServices.getDatastoreDetailList($stateParams.project).then( function(results){
    if ($stateParams.project != "") {
      $scope.dsDetailList = results.data
    }
  })

  $scope.show_Add_New_Source = function(){
    return $stateParams.project;
  }

  $scope.add_New_Datastore = function(){
    DatastoreServices.Add_Datastore($stateParams.project, $scope.newDatastoreName)
    .then(function(result){
      if (result.statusText === "OK") {
        window.location.reload();
      }
    })
  };

  $scope.delete_Datastore = function(datastoreID){
    DatastoreServices.Delete_Datastore(datastoreID).then( function(){
      window.location.reload();
    })
  };
}


// ConfigureControllerDetails.$inject = ['$scope', '$stateParams', 'DatastoreServices'];
// function ConfigureControllerDetails($scope, $stateParams, DatastoreServices) {
//
//   $scope.close_Datastore_Details = function(){
//     $scope.showStoreList = true
//     $scope.showStoreDetails = false
//   }
//
//   $scope.delete_Datastore = function(datastoreID){
//     DatastoreServices.Delete_Datastore(datastoreID).then(function(result){
//       window.location.reload();
//     })
//   };
// }


MonitorController.$inject = [ '$scope', '$stateParams', '$rootScope', 'MetricService', 'ProjectServices'];
function MonitorController($scope, $stateParams, $rootScope, MetricService, ProjectServices) {
  $scope.storageList = {}
  $rootScope.alerts = []

  ProjectServices.Get_All_Datastores().then(function(projectlist){
    for (var i = 0; i < projectlist.length; i++) {
      if ($scope.storageList[projectlist[i].Project_Name] === undefined) {
        $scope.storageList[projectlist[i].Project_Name] = []
      }
      var tempObj = {
                      key: [projectlist[i].Name],
                      values: [],
                      type: "area",
                      yAxis: 1
                    }
      $scope.storageList[projectlist[i].Project_Name].push([tempObj])
    }
  })

  $scope.getSelectedProjectMetrics = function(){
    return $scope.storageList[$stateParams.project];
  };


  MetricService.on(function (data) {
    var index = 0;

    for (var prop in data.Data_Stores) {
      var dataStoreProject = data.Data_Stores[prop].Project_Name;
      var dataStoreKey = data.Data_Stores[prop].Name;
      var dataStoreMetrics = []

      for (var i = 0; i < data.Data_Stores[prop].Metrics.length; i++) {
        dataStoreMetrics.push({
          "x": new Date(data.Data_Stores[prop].Metrics[i].Date_Time),
          "y": data.Data_Stores[prop].Metrics[i].Store_Depth
        })
      }

      for (var i = 0; i < $scope.storageList[dataStoreProject].length; i++) {
        if ($scope.storageList[dataStoreProject][i][0].key == dataStoreKey) {
          $scope.storageList[dataStoreProject][i][0].values = $scope.storageList[dataStoreProject][i][0].values.concat(dataStoreMetrics)
        }
      }
    }

    // Loop through to get our alerts now
    for (var i = 0; i < data.Alerts.length; i++) {
      $rootScope.alerts.push(data.Alerts[i])
    }

    $scope.$apply()
  });


  ProjectServices.Get_Projects().then(function(results){
    $scope.projects = results;
  });




  /* Chart options */
  // $scope.options = {
  //   chart: {
  //     type: 'cumulativeLineChart',
  //     height: 300,
  //     margin : {
  //         top: 20,
  //         right: 20,
  //         bottom: 50,
  //         left: 65
  //     },
  //     x: function(d){ return d[0]; },
  //     y: function(d){ return d[1]; },
  //     // y: function(d){ return d[1]/100; },
  //     // average: function(d) { return d.mean/100; },
  //
  //     color: d3.scale.category10().range(),
  //     duration: 300,
  //     useInteractiveGuideline: false,
  //     clipVoronoi: false,
  //
  //     xAxis: {
  //         // axisLabel: 'X Axis',
  //         tickFormat: function(d) {
  //             return d3.time.format('%I:%m:%S %p')(new Date(d))
  //         },
  //         showMaxMin: false,
  //         staggerLabels: true
  //     },
  //
  //     yAxis: {
  //         // axisLabel: 'Y Axis',
  //         tickFormat: function(d){
  //           return d;
  //             // return d3.format(',.1%')(d);
  //         },
  //         axisLabelDistance: 0
  //     }
  //   }
  // };


  // Multi-chart
  $scope.options = {
      chart: {
          type: 'multiChart',
          height: 300,
          width: 400,
          margin : {
              top: 30,
              right: 60,
              bottom: 50,
              left: 70
          },
          color: d3.scale.category10().range(),
          //useInteractiveGuideline: true,
          duration: 500,
          xAxis: {
              tickFormat: function(d){
                return d3.time.format('%I:%m:%S %p')(new Date(d));
                // return d3.format(',f')(d);
              }
          },
          yAxis1: {
              tickFormat: function(d){
                return (d);
                // return d3.format(',.1f')(d);
              }
          },
          // yAxis2: {
          //     tickFormat: function(d){
          //         return d3.format(',.1f')(d);
          //     }
          // }
      }
  };
}


AlertsController.$inject = ['$scope', 'ProjectServices'];
function AlertsController($scope, ProjectServices) {

  ProjectServices.Get_Projects().then(function(results){
    $scope.projects = results;
  })
}


alertListController.$inject = ['$scope', '$stateParams', 'AlertServices', 'ProjectServices'];
function alertListController($scope, $stateParams, AlertServices, ProjectServices) {
  $scope.showNewAlertForm = false;

  ProjectServices.Get_Project_Datastores($stateParams.project).then(function(storeList){
    if ($stateParams.project != "" && $stateParams.project != undefined) {
      $scope.Store_List = storeList;
    }
  })

  AlertServices.Get_Alert_Comparer_List().then(function(comparerList){
    $scope.Comparer_List = comparerList;
  })

  AlertServices.Get_Alerts_By_Project($stateParams.project).then(function(alertList){
    if ($stateParams.project != "" && $stateParams.project != undefined) {
      $scope.Alert_List = alertList;
    }
  })

  $scope.show_Add_New_Alert = function(){
    return $stateParams.project;
  }

  $scope.add_New_Alert = function(){
    if ($scope.selectDatastore === undefined) {
      console.log("Data store is required.");
      return;
    } else if ($scope.newAlertName === undefined) {
      console.log("Alert name is required.");
      return;
    } else if ($scope.selectedComparer === undefined) {
      console.log("An alert comparer is required.");
      return;
    }else if ($scope.newAlertValue === undefined) {
      console.log("Alert value is required.");
      return;
    }

    var alert_info = {
      Datastore_ID: $scope.selectDatastore,
      Alert_Name: $scope.newAlertName,
      Alert_Comparer: $scope.selectedComparer,
      Alert_Value: $scope.newAlertValue
    }
    AlertServices.Add_Alert(alert_info);
    window.location.reload();
  }

  $scope.delete_Alert = function(alert_id){
    AlertServices.Delete_Alert(alert_id);
    window.location.reload();
  }

  $scope.save_Alert_Updates = function(id, name, comparer, value, enabled){
    var alert_info = {
      id: id,
      name: name,
      comparer: comparer,
      value: value,
      enabled: enabled
    }
    AlertServices.Update_Alert(alert_info)
    window.location.reload();
  }

}
