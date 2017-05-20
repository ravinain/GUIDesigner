package com.practice.git.guidesigner.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by cdacr on 5/21/2017.
 */
@Controller
public class HomeController {

    @RequestMapping("/")
    public String index(){
        return "index";
    }
}
