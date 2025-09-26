package graphql.controller;

import graphql.entity.Product;
import graphql.input.ProductInput;
import graphql.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import java.util.Optional;
import java.util.List;

@Controller
public class ProductController {
    @Autowired
    private ProductService productService;

    @QueryMapping
    public List<Product> allProductsByPrice() {
        return productService.getAllProductsSortedByPrice();
    }
    
    @QueryMapping
    public Optional<Product> productById(@Argument Long id) {
        return productService.getProductById(id);
    }
    @QueryMapping
    public List<Product> productsByCategory(@Argument Long categoryId) {
        return productService.getProductsByCategoryId(categoryId);
    }

    @MutationMapping
    public Product createProduct(@Argument ProductInput productInput) {
        return productService.createProduct(productInput);
    }

    @MutationMapping
    public Product updateProduct(@Argument Long id, @Argument ProductInput productInput) {
        return productService.updateProduct(id, productInput).orElse(null);
    }

    @MutationMapping
    public boolean deleteProduct(@Argument Long id) {
        return productService.deleteProduct(id);
    }
}