# Application Entity Diagram

This application is a client-side React retail app. Its main business data is stored in React context and `localStorage`.

## Mermaid ER Diagram

```mermaid
erDiagram
    USER ||--o| SESSION : creates
    USER ||--o{ ORDER : places
    USER ||--o| CUSTOMER_PROFILE : maintains
    USER ||--o{ PAYMENT_METHOD : stores
    USER ||--o| CUSTOMER_CONSENT : sets
    USER ||--o{ AUDIT_LOG : generates

    MANAGER ||--o{ INVENTORY_MOVEMENT : records

    PRODUCT }o--o{ CATEGORY : belongs_to
    PRODUCT ||--|| INVENTORY : has
    INVENTORY ||--o{ INVENTORY_MOVEMENT : tracks

    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : appears_in

    USER {
      int id PK
      string name
      string email
      string password
      string role
      string provider
      datetime createdAt
    }

    SESSION {
      int id PK
      int userId FK
      string role
      string provider
      datetime loginTime
    }

    MANAGER {
      int id PK
      string name
      string email
      string phone
      string status
      date joinDate
    }

    CUSTOMER_PROFILE {
      int userId PK,FK
      string fullName
      string email
      string phone
      datetime updatedAt
    }

    PAYMENT_METHOD {
      int id PK
      int userId FK
      string type
      string cardHolder
      string last4
      string maskedNumber
      string expiry
      string billingZip
      datetime updatedAt
    }

    CUSTOMER_CONSENT {
      int userId PK,FK
      boolean essentialProcessing
      boolean marketingEmails
      boolean analyticsTracking
      boolean personalizedOffers
      datetime updatedAt
    }

    AUDIT_LOG {
      int id PK
      int userId FK
      string action
      string detail
      datetime at
    }

    CATEGORY {
      string name PK
      string image
    }

    PRODUCT {
      int id PK
      string productType
      string name
      string description
      decimal price
      decimal salePrice
      string image
      string material
      string finish
      string warranty
      string leadTime
    }

    INVENTORY {
      string sku PK
      int productId FK
      int onHand
      int reserved
      int reorderLevel
      int reorderQty
      decimal averageDailyUsage
      string location
      string supplier
      int leadTimeDays
      datetime lastAuditAt
      datetime lastUpdatedAt
    }

    INVENTORY_MOVEMENT {
      string id PK
      string sku FK
      int productId FK
      string type
      int quantity
      int previousOnHand
      int newOnHand
      string reason
      string actor
      string reference
      datetime at
    }

    ORDER {
      int id PK
      int userId FK
      string customer
      string customerEmail
      string customerPhone
      string status
      date date
      string orderTime
      decimal amount
      decimal subtotal
      decimal taxAmount
      decimal shippingFee
      decimal total
      string paymentMethod
      string cardLast4
      datetime createdAt
      string source
    }

    ORDER_ITEM {
      string lineId PK
      int orderId FK
      int productId FK
      string name
      int quantity
      decimal price
      string selectedColor
      string selectedSize
    }
```

## Plain Text Version

```text
USER
- id (PK)
- name
- email
- password
- role [admin, manager, customer]
- provider [password, google]
- createdAt

SESSION
- id (PK)
- userId (FK -> USER.id)
- role
- provider
- loginTime

MANAGER
- id (PK)
- name
- email
- phone
- status
- joinDate

CATEGORY
- name (PK)
- image

PRODUCT
- id (PK)
- productType
- name
- description
- price
- salePrice
- image
- categories [many]
- industries [many]
- colors [many]
- sizes [many]
- material
- finish
- warranty
- leadTime
- specs

INVENTORY
- sku (PK)
- productId (FK -> PRODUCT.id)
- onHand
- reserved
- reorderLevel
- reorderQty
- averageDailyUsage
- location
- supplier
- leadTimeDays
- lastAuditAt
- lastUpdatedAt

INVENTORY_MOVEMENT
- id (PK)
- sku (FK -> INVENTORY.sku)
- productId (FK -> PRODUCT.id)
- type [INIT, IN, OUT]
- quantity
- previousOnHand
- newOnHand
- reason
- actor
- reference
- at

ORDER
- id (PK)
- userId (FK -> USER.id, logical link)
- customer
- customerEmail
- customerPhone
- shippingAddress
- status
- date
- orderTime
- amount
- pricing { subtotal, taxRate, taxAmount, shippingFee, total }
- payment { method, cardLast4, expiryDate }
- createdAt
- source

ORDER_ITEM
- lineId (PK)
- orderId (FK -> ORDER.id)
- productId (FK -> PRODUCT.id)
- name
- quantity
- price
- selectedColor
- selectedSize

CUSTOMER_PROFILE
- userId (PK/FK -> USER.id)
- fullName
- email
- phone
- updatedAt

PAYMENT_METHOD
- id (PK)
- userId (FK -> USER.id)
- type
- cardHolder
- last4
- maskedNumber
- expiry
- billingZip
- updatedAt

CUSTOMER_CONSENT
- userId (PK/FK -> USER.id)
- essentialProcessing
- marketingEmails
- analyticsTracking
- personalizedOffers
- updatedAt

AUDIT_LOG
- id (PK)
- userId (FK -> USER.id)
- action
- detail
- at

RELATIONSHIPS
- USER places ORDER
- ORDER contains ORDER_ITEM
- PRODUCT appears in ORDER_ITEM
- PRODUCT belongs to CATEGORY
- PRODUCT has one INVENTORY record
- INVENTORY has many INVENTORY_MOVEMENT records
- MANAGER records INVENTORY_MOVEMENT
- USER maintains CUSTOMER_PROFILE
- USER stores PAYMENT_METHOD
- USER sets CUSTOMER_CONSENT
- USER generates AUDIT_LOG
```

## Source References

- Product model: `src/data/products.js`
- Product inventory and categories: `src/context/ProductContext.js`
- Orders and order items: `src/context/OrderContext.js`
- Staff, customer users, and sessions: `src/context/AuthContext.js`
- Customer profile, payment methods, consent, and audit log: `src/pages/CustomerPortal.js`
- Checkout payload that connects cart to orders: `src/pages/Checkout.js`
