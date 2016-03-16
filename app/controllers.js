angular.module('DataNexus')
  .controller('LandingController', LandingController)
  .controller('ConfigureController', ConfigureController)
  .controller('ConfigureControllerDetails', ConfigureControllerDetails)
  .controller('SecurityController', SecurityController)
  .controller('MonitorController', MonitorController);

LandingController.$inject = ['$scope'];
function LandingController($scope) {
}


ConfigureControllerDetails.$inject = ['$scope', '$stateParams', 'DatastoreServices'];
function ConfigureControllerDetails($scope, $stateParams, DatastoreServices) {

  DatastoreServices.getDatastoreDetailList($stateParams.project).then( function(results){
    // console.log('Loading datastores for ' + $stateParams.project + "...");
    $scope.dsDetailList = results.data
  })
}


ConfigureController.$inject = ['$scope', '$stateParams', 'ProjectServices', 'DatastoreServices'];
function ConfigureController($scope, $stateParams, ProjectServices, DatastoreServices) {
  $("[name='my-checkbox']").bootstrapSwitch();

  ProjectServices.Get_Projects().then(function(results){
    // console.log("getting projects...");
    $scope.projects = results;
  })

  // $scope.getProjectDetailList = function(){
    // console.log("Project name from state: ", $stateParams.project);
    // var testProject = $stateParams.project
    // $stateParams.project = "Project 1"
    // console.log("testProject: ", $stateParams.project);

    // DatastoreServices.getDatastoreDetailList().then(function(data){
      // console.log(data)
      // return data
      // $stateParams.datasourceList = ["DS1", "DS2"]
      // return $stateParams.datasourceList
    // })

      // DatastoreServices.getDatastoreDetailList().then(function(datastoreList){
        // $scope.datastoreList = datastoreList.data;
        // console.log(datastoreList.data);
        // return datastoreList.data
        // $scope.$apply()
      // })
      // return $scope.storageList[$stateParams.project];
    // else {
      // return []
    // }
  // };

}


SecurityController.$inject = ['$scope'];
function SecurityController($scope) {
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
