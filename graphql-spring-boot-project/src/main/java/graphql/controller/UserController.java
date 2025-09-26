package graphql.controller;

import graphql.entity.User;
import graphql.input.UserInput;
import graphql.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class UserController {
    @Autowired
    private UserService userService;

    @QueryMapping
    public List<User> allUsers() {
        return userService.getAllUsers();
    }

    @QueryMapping
    public User userById(@Argument Long id) {
        return userService.getUserById(id).orElse(null);
    }

    @MutationMapping
    public User createUser(@Argument UserInput userInput) {
        return userService.createUser(userInput);
    }

    @MutationMapping
    public User updateUser(@Argument Long id, @Argument UserInput userInput) {
        return userService.updateUser(id, userInput).orElse(null);
    }

    @MutationMapping
    public boolean deleteUser(@Argument Long id) {
        return userService.deleteUser(id);
    }
}
