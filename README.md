![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-distru

This repository contains n8n community nodes to integrate with **Distru**, a full-stack inventory, warehouse, and order management platform designed specifically for the cannabis industry. These nodes enable seamless automation of your Distru workflows directly within n8n.

## 🎯 Features

The package currently includes the following nodes:

### DistruOrder
- Create new sales orders
- Retrieve orders by ID
- Get multiple orders with filtering options
- Manage order statuses and details

### DistruCompany
- Fetch company information
- Manage company records
- Search and filter companies
- Handle company-related operations

### DistruProduct
- Create and manage products
- Retrieve product details
- Search product catalog
- Handle product inventory operations

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:
- [Node.js](https://nodejs.org/en/) version 18.12 or higher
- [pnpm](https://pnpm.io/) package manager (version 9.1 or higher)
- [n8n](https://n8n.io/) installed globally (`pnpm install -g n8n`)
- A Distru account with API access

### Installation

1. Install the package in your n8n installation:
   ```bash
   pnpm install n8n-nodes-distru
   ```

2. Restart your n8n instance to load the new nodes.

### Configuration

1. In your n8n instance, go to **Settings** > **Credentials**
2. Click on **New Credential**
3. Search for "Distru API"
4. Enter your Distru API token
5. (Optional) Toggle "Use Staging Environment" if you want to use the staging API

## 🔧 Development Setup

If you want to contribute or modify these nodes:

1. Clone the repository:
   ```bash
   git clone https://github.com/Sebbytea/distru-n8n.git
   cd distru-n8n
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Build the package:
   ```bash
   pnpm build
   ```

4. Link to your local n8n installation:
   ```bash
   pnpm link
   ```

## 📚 Usage Examples

### Creating a Sales Order

1. Add the **DistruOrder** node to your workflow
2. Select the "Create" operation
3. Configure required fields:
   - Company ID
   - Billing Location ID
   - Shipping Location ID
   - Order Items
4. Optional: Set additional fields like due date, delivery date, and notes

### Managing Products

1. Use the **DistruProduct** node
2. Choose from available operations:
   - Create new products
   - Update existing products
   - Search product catalog
   - Manage inventory levels

### Company Operations

1. Implement the **DistruCompany** node
2. Available operations include:
   - Fetch company details
   - Search companies
   - Manage company relationships

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the [MIT License](LICENSE.md).

## 🔗 Useful Links

- [Distru API Documentation](https://docs.distru.com/api)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [n8n Community Forum](https://community.n8n.io/)

## 📫 Support

For support with these nodes, please:
1. Check the [GitHub Issues](https://github.com/Sebbytea/distru-n8n/issues) for existing problems and solutions
2. Create a new issue if your problem isn't already reported
3. Contact Distru support for API-specific questions

---

Made with ❤️ by Sebastian Tidwell
