/*
 Navicat Premium Data Transfer

 Source Server         : Mysql
 Source Server Type    : MySQL
 Source Server Version : 80012
 Source Host           : localhost:3306
 Source Schema         : qix

 Target Server Type    : MySQL
 Target Server Version : 80012
 File Encoding         : 65001

 Date: 21/10/2018 20:34:45
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for permissions
-- ----------------------------
DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions`  (
  `RoleId` int(11) NOT NULL,
  `PermissionName` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of permissions
-- ----------------------------
INSERT INTO `permissions` VALUES (10000, 'admin');
INSERT INTO `permissions` VALUES (10001, 'User.Delete');
INSERT INTO `permissions` VALUES (10001, 'User.Delete');
INSERT INTO `permissions` VALUES (10001, 'User.Delete');
INSERT INTO `permissions` VALUES (10002, 'User.Read');

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`  (
  `Id` int(11) NOT NULL,
  `RoleName` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

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
  `Id` int(11) NOT NULL,
  `UserName` longtext CHARACTER SET utf8 COLLATE utf8_general_ci,
  `NickName` longtext CHARACTER SET utf8 COLLATE utf8_general_ci,
  `Password` longtext CHARACTER SET utf8 COLLATE utf8_general_ci,
  `RoleId` int(11) DEFAULT NULL,
  `IsDelete` int(255) DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (10000, 'qix', '阿星Plus', 'e10adc3949ba59abbe56e057f20f883e', 10000, 0);
INSERT INTO `users` VALUES (10001, 'admin', '管理员', 'e10adc3949ba59abbe56e057f20f883e', 10000, 0);
INSERT INTO `users` VALUES (10002, 'editor1', '1号编辑', 'e10adc3949ba59abbe56e057f20f883e', 10001, 0);
INSERT INTO `users` VALUES (10003, 'editor2', '2号编辑', 'e10adc3949ba59abbe56e057f20f883e', 10001, 0);
INSERT INTO `users` VALUES (10004, 'editor3', '3号编辑', 'e10adc3949ba59abbe56e057f20f883e', 10001, 0);
INSERT INTO `users` VALUES (10005, 'user1', '1号用户', 'e10adc3949ba59abbe56e057f20f883e', 10002, 0);
INSERT INTO `users` VALUES (10006, 'user2', '2号用户', 'e10adc3949ba59abbe56e057f20f883e', 10002, 0);
INSERT INTO `users` VALUES (10007, 'user3', '3号用户', 'e10adc3949ba59abbe56e057f20f883e', 10002, 0);

SET FOREIGN_KEY_CHECKS = 1;
