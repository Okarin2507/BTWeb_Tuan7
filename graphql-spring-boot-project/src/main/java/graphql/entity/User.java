package graphql.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode; 
import lombok.ToString; 
import java.util.List;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fullname;
    private String email;
    private String password;
    private String phone;
    
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private List<Product> products;
}