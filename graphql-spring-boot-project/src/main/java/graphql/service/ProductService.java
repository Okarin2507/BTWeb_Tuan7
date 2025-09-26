package graphql.service;

import graphql.entity.Category;
import graphql.entity.Product;
import graphql.entity.User;
import graphql.input.ProductInput;
import graphql.repository.CategoryRepository;
import graphql.repository.ProductRepository;
import graphql.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Product> getAllProductsSortedByPrice() {
        return productRepository.findAllByOrderByPriceAsc();
    }
	public Optional<Product> getProductById(Long id) {
	    return productRepository.findById(id);
	}
    public List<Product> getProductsByCategoryId(Long categoryId) {
        // === SỬA ĐỔI QUAN TRỌNG ===
        // Gọi đến phương thức mới `findProductsByCategoryId` trong repository.
        return productRepository.findProductsByCategoryId(categoryId);
    }

    @Transactional
    public Product createProduct(ProductInput productInput) {
        Product product = new Product();
        product.setTitle(productInput.getTitle());
        product.setQuantity(productInput.getQuantity());
        product.setDescription(productInput.getDescription());
        product.setPrice(productInput.getPrice());

        User user = userRepository.findById(productInput.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        product.setUser(user);

        if (productInput.getCategoryIds() != null && !productInput.getCategoryIds().isEmpty()) {
            Set<Category> categories = productInput.getCategoryIds().stream()
                .map(id -> categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found: " + id)))
                .collect(Collectors.toSet());
            product.setCategories(categories);
        }
        return productRepository.save(product);
    }
    
    @Transactional
    public Optional<Product> updateProduct(Long id, ProductInput productInput) {
        return productRepository.findById(id).map(product -> {
            product.setTitle(productInput.getTitle());
            product.setQuantity(productInput.getQuantity());
            product.setDescription(productInput.getDescription());
            product.setPrice(productInput.getPrice());

            User user = userRepository.findById(productInput.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
            product.setUser(user);

            if (productInput.getCategoryIds() != null) {
                Set<Category> categories = new HashSet<>(categoryRepository.findAllById(productInput.getCategoryIds()));
                product.setCategories(categories);
            }
            return productRepository.save(product);
        });
    }

    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }
}