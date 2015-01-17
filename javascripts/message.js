//code by Cagan Senturk for KanalApp.com

'use strict';
var app = angular.module('kanal', []);

app.service('Memory', function(){
  var mem = {};
  return{
    setToken: function(token){
      mem.token = token;
    },
    getToken: function(){
      return mem.token;
    }
  }
});

app.factory('authInterceptor', function ($injector, Memory) {
  return {
    request: function (config) {
      config.headers = config.headers || {};

      if (Memory.getToken()){
         //add user authorization header to all requests to kanal server
         config.headers.Authorization = 'Bearer ' + Memory.getToken();
       }
       return config;
     }
   };
 });

app.config(function($httpProvider){
  $httpProvider.interceptors.push('authInterceptor');
});

app.controller('MessageCtrl', function($scope, $http, $timeout, Memory){
  var server = 'https://www.kanalapp.com';
  var message = this;
  message.info = {};
  message.channel = {private: true};

  message.getChannels = function(){
    message.processing = true;
    message.error = null;
    message.done = false;
    message.channels = null;
    Memory.setToken(message.info.token);
    $http.get(server + '/api/channels').success(function(channels){
      message.channels = channels;
    }).error(function(err){
      message.error = err;
    }).finally(function(){
      message.processing = false;
    })
  };

  message.createChannel = function(){
    message.processing = true;
    message.error = null;
    $http.post(server + '/api/channels', message.channel).success(function(channel){
      message.channel = {private: true};
      message.getChannels();
    }).error(function(err){
      message.error = err;
    }).finally(function(){
      message.processing = false;
    })
  };

  message.messageMode = function(channel){
    message.done = false;
    message.chosen = channel;
    message.chosenUrl = server + '/channels/view/' + channel.name;
    message.message = {};
  };

  message.sendMessage = function(){
    message.processing = true;
    $http.post(server + '/api/channels/' + message.chosen.id + '/messages', message.message).success(function(){
      message.message = {};
      message.done = true;
    }).error(function(err){
      message.error = err;
    }).finally(function(){
      message.processing = false;
    })
  }
})