/*
 Navicat Premium Data Transfer

 Source Server         : 118.24.6.176
 Source Server Type    : MySQL
 Source Server Version : 80012
 Source Host           : 118.24.6.176:3306
 Source Schema         : intelligentmonitor

 Target Server Type    : MySQL
 Target Server Version : 80012
 File Encoding         : 65001

 Date: 13/11/2018 10:10:35
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for charts
-- ----------------------------
DROP TABLE IF EXISTS `charts`;
CREATE TABLE `charts`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `ChartsName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `ItemId` int(11) DEFAULT NULL,
  `TimeFrom` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `TimeTill` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `ItemName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `IsDelete` int(255) DEFAULT 0,
  `CreateTime` datetime(0) DEFAULT NULL,
  `Seq` int(11) DEFAULT 0,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of charts
-- ----------------------------

-- ----------------------------
-- Table structure for permissions
-- ----------------------------
DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `RoleId` int(11) NOT NULL,
  `PermissionName` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `PermissionDescribe` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10009 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of permissions
-- ----------------------------
INSERT INTO `permissions` VALUES (10000, 10000, 'User', '具有管理员权限');
INSERT INTO `permissions` VALUES (10001, 10000, 'User.Editor', '具有编辑者权限');
INSERT INTO `permissions` VALUES (10002, 10000, 'User.Read', '具有查看权限');
INSERT INTO `permissions` VALUES (10003, 10001, 'User.Editor', '具有编辑者权限');
INSERT INTO `permissions` VALUES (10004, 10001, 'User.Read', '具有查看权限');
INSERT INTO `permissions` VALUES (10005, 10002, 'User.Read', '具有查看权限');

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `RoleName` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10003 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES (10000, '管理员');
INSERT INTO `roles` VALUES (10001, '编辑');
INSERT INTO `roles` VALUES (10002, '用户');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `UserName` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `NickName` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Password` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `RoleId` int(11) DEFAULT NULL,
  `IsDelete` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10046 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (10000, 'qix', '阿星Plus', '85FD3B0F723924DE68678E3D9C8563DF', 10000, 0);
INSERT INTO `users` VALUES (10001, 'admin1', '1号管理员', 'E10ADC3949BA59ABBE56E057F20F883E', 10000, 0);
INSERT INTO `users` VALUES (10002, 'admin2', '2号管理员', 'E10ADC3949BA59ABBE56E057F20F883E', 10000, 0);
INSERT INTO `users` VALUES (10003, 'admin3', '3号管理员', 'E10ADC3949BA59ABBE56E057F20F883E', 10000, 0);
INSERT INTO `users` VALUES (10004, 'admin4', '4号管理员', 'E10ADC3949BA59ABBE56E057F20F883E', 10000, 0);
INSERT INTO `users` VALUES (10005, 'admin5', '5号管理员', 'E10ADC3949BA59ABBE56E057F20F883E', 10000, 0);
INSERT INTO `users` VALUES (10006, 'editor1', '1号编辑', 'E10ADC3949BA59ABBE56E057F20F883E', 10001, 0);
INSERT INTO `users` VALUES (10007, 'editor2', '2号编辑', 'E10ADC3949BA59ABBE56E057F20F883E', 10001, 0);
INSERT INTO `users` VALUES (10008, 'editor3', '3号编辑', 'E10ADC3949BA59ABBE56E057F20F883E', 10001, 0);
INSERT INTO `users` VALUES (10009, 'editor4', '4号编辑', 'E10ADC3949BA59ABBE56E057F20F883E', 10001, 0);
INSERT INTO `users` VALUES (10010, 'editor5', '5号编辑', 'E10ADC3949BA59ABBE56E057F20F883E', 10001, 0);
INSERT INTO `users` VALUES (10011, 'editor6', '6号编辑', 'E10ADC3949BA59ABBE56E057F20F883E', 10001, 0);
INSERT INTO `users` VALUES (10012, 'editor7', '7号编辑', 'E10ADC3949BA59ABBE56E057F20F883E', 10001, 0);
INSERT INTO `users` VALUES (10013, 'editor8', '8号编辑', 'E10ADC3949BA59ABBE56E057F20F883E', 10001, 0);
INSERT INTO `users` VALUES (10014, 'editor9', '9号编辑', 'E10ADC3949BA59ABBE56E057F20F883E', 10001, 0);
INSERT INTO `users` VALUES (10015, 'editor10', '10号编辑', 'E10ADC3949BA59ABBE56E057F20F883E', 10001, 0);
INSERT INTO `users` VALUES (10016, 'user1', '1号用户', 'E10ADC3949BA59ABBE56E057F20F883E', 10002, 0);
INSERT INTO `users` VALUES (10017, 'user2', '2号用户', 'E10ADC3949BA59ABBE56E057F20F883E', 10002, 0);
INSERT INTO `users` VALUES (10018, 'user3', '3号用户', 'E10ADC3949BA59ABBE56E057F20F883E', 10002, 0);
INSERT INTO `users` VALUES (10019, 'user4', '4号用户', 'E10ADC3949BA59ABBE56E057F20F883E', 10002, 0);
INSERT INTO `users` VALUES (10020, 'user5', '5号用户', 'E10ADC3949BA59ABBE56E057F20F883E', 10002, 0);
INSERT INTO `users` VALUES (10021, 'user6', '6号用户', 'E10ADC3949BA59ABBE56E057F20F883E', 10002, 0);
INSERT INTO `users` VALUES (10022, 'user7', '7号用户', 'E10ADC3949BA59ABBE56E057F20F883E', 10002, 0);
INSERT INTO `users` VALUES (10023, 'user8', '8号用户', 'E10ADC3949BA59ABBE56E057F20F883E', 10002, 0);
INSERT INTO `users` VALUES (10024, 'user9', '9号用户', 'E10ADC3949BA59ABBE56E057F20F883E', 10002, 0);
INSERT INTO `users` VALUES (10025, 'user10', '10号用户', 'E10ADC3949BA59ABBE56E057F20F883E', 10002, 0);

SET FOREIGN_KEY_CHECKS = 1;
