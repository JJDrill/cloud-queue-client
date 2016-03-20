angular.module('DataNexus')
  .controller('SignupController', SignupController)
  .controller('LoginController', LoginController)
  .controller('ConfigureController', ConfigureController)
  .controller('ConfigureControllerProjects', ConfigureControllerProjects)
  .controller('ConfigureControllerDetails', ConfigureControllerDetails)
  .controller('MonitorController', MonitorController);

LoginController.$inject = ['$scope', '$location', 'AuthServices'];
function LoginController($scope, $location, AuthServices) {

  $scope.Login = function(){
    AuthServices.Login($scope.username, $scope.password)
    $location.path('/monitor/');
  }

  $scope.Logout = function(){
    $location.path('/');
  }

}


SignupController.$inject = ['$scope', '$location', 'AuthServices'];
function SignupController($scope, $location, AuthServices) {

  $scope.Signup = function(){
    AuthServices.Signup($scope.newUsername, $scope.newPassword).then(function(result){
      console.log(result);
      $location.path('/monitor/');
    })
  }

}


ConfigureController.$inject = ['$scope', '$stateParams', 'ProjectServices', 'DatastoreServices'];
function ConfigureController($scope, $stateParams, ProjectServices, DatastoreServices) {
  $("[name='my-checkbox']").bootstrapSwitch();

  ProjectServices.Get_Projects().then(function(results){
    // console.log("getting projects...");
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


ConfigureControllerDetails.$inject = ['$scope', '$stateParams', 'DatastoreServices'];
function ConfigureControllerDetails($scope, $stateParams, DatastoreServices) {

  DatastoreServices.getDatastoreDetailList($stateParams.project).then( function(results){
    // console.log('Loading datastores for ' + $stateParams.project + "...");
    if ($stateParams.project != "") {
      $scope.dsDetailList = results.data
    }
  })

  $scope.add_New_Datastore = function(){
    DatastoreServices.Add_Datastore($stateParams.project, $scope.newDatastoreName)
    .then(function(result){
      if (result.statusText === "OK") {
        window.location.reload();
      }
    })
  };

  $scope.delete_Datastore = function(datastoreID){
    DatastoreServices.Delete_Datastore(datastoreID).then(function(result){
      window.location.reload();
    })
  };
}


MonitorController.$inject = [ '$scope', '$stateParams', 'MetricService', 'ProjectServices'];
function MonitorController($scope, $stateParams, MetricService, ProjectServices) {
  $scope.storageList = {}

  ProjectServices.Get_Project_Datastores().then(function(projectlist){
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
    console.log($scope.storageList[$stateParams.project]);
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
    // console.log("storageList: ", $scope.storageList);
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




// AdminController.$inject = ['$scope', 'PerformanceServices'];
// function AdminController($scope, PerformanceServices) {
//   var test1;
//
//   $scope.Start_Test = function(test_id){
//     console.log("Starting test: ", test_id);
//     var url = "http://localhost:3000/api/queues/1/dequeue"
//
//     test1 = setInterval(function () {
//       PerformanceServices.Send_Generic_Get_Request(url).then(function(result){
//         console.log("Test iteration...");
//       })
//     }, 2000)
//   }
//
//   $scope.Stop_Test = function(test_id){
//     console.log("Ending test: ", test_id);
//     clearInterval(test1);
//   }
//
// }
