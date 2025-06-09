package com.blog.blog.services.impl;

import com.blog.blog.domain.entities.Category;
import com.blog.blog.repositories.CategoryRepository;
import com.blog.blog.services.CategoryService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor // generates constructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<Category> listCategories() {
        return categoryRepository.findAllWithPostCounts(); // returns list of categories
    }

    @Override
    @Transactional
    public Category createCategory(Category category) {
        if(categoryRepository.existsByNameIgnoreCase(category.getName())){
            throw new IllegalArgumentException("Category with name " + category.getName() + " already exists");
        }
        return categoryRepository.save(category);
    }

    @Override
    public void deleteCategory(UUID id) {
       Optional<Category> category =  categoryRepository.findById(id);
       if(category.isPresent()){
           if(category.get().getPosts().size()>0){
               throw new IllegalStateException("Category with id " + id + " has posts");
           }
           categoryRepository.deleteById(id);
       }
    }

    @Override
    public Category getCategoryById(UUID id) {
       categoryRepository.findById(id)
               .orElseThrow(() -> new EntityNotFoundException("Category with id " + id + " does not exist"));
       return categoryRepository.findById(id).get();
    }
}
