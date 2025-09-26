package graphql.input;

import lombok.Data;
import java.util.List;

@Data
public class ProductInput {
    private String title;
    private int quantity;
    private String description;
    private double price;
    private Long userId;
    private List<Long> categoryIds;
}