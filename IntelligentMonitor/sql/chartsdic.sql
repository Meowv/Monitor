/*
 Navicat Premium Data Transfer

 Source Server         : Mysql
 Source Server Type    : MySQL
 Source Server Version : 80012
 Source Host           : localhost:3306
 Source Schema         : intelligentmonitor

 Target Server Type    : MySQL
 Target Server Version : 80012
 File Encoding         : 65001

 Date: 31/10/2018 22:07:07
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for chartsdic
-- ----------------------------
DROP TABLE IF EXISTS `chartsdic`;
CREATE TABLE `chartsdic`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `key` longtext CHARACTER SET utf8 COLLATE utf8_general_ci,
  `value` longtext CHARACTER SET utf8 COLLATE utf8_general_ci,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of chartsdic
-- ----------------------------
INSERT INTO `chartsdic` VALUES (1, 'chartsId', 'charts3,charts5,charts1,charts6,charts2,charts4');

SET FOREIGN_KEY_CHECKS = 1;
