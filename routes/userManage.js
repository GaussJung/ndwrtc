'use strict';
var express = require('express');
var router = express.Router();
 
import {getUserList, findUserById } from "./user";
 
const userList = getUserList(); // 데이터베이스 있는 것으로 가정 ( assume for now this is your database ) 
 
// ============================================== F40. 샘플 API생성  ==============================================
// GET Call for all users
// URL : http://localhost/api/user/list
router.get("/list", (req, res) => {

    return res.status(200).send({
      success: "true",
      message: "users",
      users: userList,
    });
  
});
  
  
// 추가 POST call - Means you are adding new user into database 
// URL : http://localhost/api/user/addUser
router.post("/addUser", (req, res) => {
  
    if (!req.body.name) {
      return res.status(400).send({
        success: "false",
        message: "name is required",
      });
    } else if (!req.body.companies) {
      return res.status(400).send({
        success: "false",
        message: "companies is required",
      });
    }
    
    const user = {
      id: userList.length + 1,
      isPublic: req.body.isPublic,
      name:  req.body.name,
      companies: req.body.companies,
      books:  req.body.books
    };
  
    userList.push(user);
  
    return res.status(201).send({
      success: "true",
      message: "user added successfully",
      user,
    });
  
  });
  
  // 갱신 / PUt call - Means you are updating new user into database 
  // URL : http://localhost/api/user/1
  router.put("/:userId", (req, res) => {
    console.log(req.params)
    const id = parseInt(req.params.userId, 10);
    const userFound=findUserById(id)
     
    if (!userFound) {
      return res.status(404).send({
        success: 'false',
        message: 'user not found',
      });
    }
  
    const updatedUser= {
        id: id,
        isPublic: req.body.isPublic || userFound.body.isPublic,
        name:req.body.name || userFound.body.name,
        companies: req.body.companies || userFound.body.companies,
        books: req.body.books || userFound.body.books
     };
  
    if (!updatedUser.name) {
      return res.status(400).send({
        success: "false",
        message: "name is required",
      });
    } else if (!updatedUser.companies) {
      return res.status(400).send({
        success: "false",
        message: "companies is required",
      });
    }
  
    for (let i = 0; i < userList.length; i++) {
        if (userList[i].id === id) {
            userList[i] = updatedUser;
            return res.status(201).send({
              success: 'true',
              message: 'user updated successfully',
              updatedUser
            
            });
        }
    }
  
    return  res.status(404).send({
              success: 'true',
              message: 'error in update'
    });
  
  });
  
  // 삭제 / Delete call - Means you are deleting new user from database 
  // URL : http://localhost/api/user/1
  router.delete("/:userId", (req, res) => {
    console.log(req.params)
    const id = parseInt(req.params.userId, 10);
    console.log(id)
    for(let i = 0; i < userList.length; i++){
        if(userList[i].id === id){
             userList.splice(i,1);
             return res.status(201).send({
              success: 'true',
              message: 'user deleted successfully'
            });
        }
    }
  
    return res.status(404).send({
                success: 'true',
                message: 'error in delete'   
    });
  
  });
 
module.exports = router;
