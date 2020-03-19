'use strict';

const tags = [
  // languages
  'javascript',
  'css',
  'css3',
  'html',
  'html5',
  'typescript',
  'reasonml',
  'flow',
  'python 2',
  'python 3',
  'kotlin',
  'golang',
  'dart',
  'java',
  'php',
  'objective-c',
  'c',
  'c++',
  'c#',
  'sql',
  'rust',
  'haskell',
  'wasm',
  'swift',
  'ruby',
  'regex',
  'bash',
  'scala',
  'matlab',

  //format data
  'json',
  'xml',
  'yaml',
  'jsx',

  //library
  'jquery',
  'd3',
  'three',
  'modernizr',

  // ui
  'bootstrap',
  'ant design',
  'material',

  // framework
  'react',
  'angular 1',
  'angular',
  'vue',
  'ember',
  'meteor',
  'node',
  'backbone',
  'ionic',
  'react native',
  'native script',
  'flutter',

  // MQ
  'apache kafka',
  'rabbitmq',
  'nats',

  // Technology
  'websocket',
  'blockchain',
  'internet of things',
  'mixed reality',
  'big data',
  'ar',
  'vr',
  'ci/cd',
  'pwa',
  'security',
  'cui',
  'terminal',
  'sockets',
  'http',
  'https',
  'opencv',
  'tensorflow',

  //service
  'lets encrypt',
  'firebase',
  'aws',
  'azure',

  //server
  'apache',
  'caddy',
  'nginx',

  // OS
  'android',
  'ios',
  'windows',
  'linux',
  'macos',

  // databases
  'sqlite',
  'postgresql',
  'mysql',
  'oracle database',
  'microsoft sql server',
  'mongodb',
  'cassandra',
  'redis',
  'elasticsearch',
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    const date = new Date();

    return queryInterface.bulkInsert(
      'Feedback_Tags',
      tags.map((name) => ({
        name,
        createdAt: date,
        updatedAt: date,
      })),
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Feedback_Tags', null, {});
  },
};
