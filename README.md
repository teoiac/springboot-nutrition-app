# NutriFit - Nutrition Blog Platform
## Project Overview  
NutriFit is a comprehensive nutrition platform combining:  
1. **Educational Blog** - Authoritative articles on nutrition and healthy living  
2. **Consultation Hub** - Appointment booking with nutrition professionals  

### Core Functionality  
 **User Management**  
- Registration/authentication (JWT)  
- Role-based access control (Admin/User)  

**Content Management**  
- CRUD operations for blog posts  
- Draft/published post states  
- Category/tag organization  

 **Consultation System**  
- Appointment booking workflow  
- Admin booking management console  
- Service information pages  

 **Communication**  
- Contact form with message dashboard  
- Nutritionist profile/about section  

### User Flows  
- **Readers**: Browse content, book consultations  
- **Admin**: Full CMS capabilities, message management  

## Technical Architecture  

### Frontend  
- **Framework**: React with TypeScript  
- **UI**: Responsive design with Tailwind CSS

### Backend  
- **Framework**: Spring Boot - Java
- **Security**: JWT Authentication  
- **API**: RESTful endpoints 

### Database  
- **System**: PostgreSQL (Relational)  
- **ORM**: Hibernate/JPA  

### Infrastructure  
- **Pattern**: MVC  
- **Packaging**:  
  - `controller` - API endpoints  
  - `service` - Business logic  
  - `repository` - Data access  
  - `domain` - DTOs and Entities
  - `security` - Auth components  
  - `config` - Application configuration  


