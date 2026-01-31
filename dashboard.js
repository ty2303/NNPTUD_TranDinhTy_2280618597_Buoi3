// Dashboard Product Manager - Step 5: All Features Complete
const API_URL = 'https://api.escuelajs.co/api/v1/products';

class ProductDashboard {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.sortColumn = null;
        this.sortDirection = 'asc';
        
        this.init();
    }

    async init() {
        await this.fetchProducts();
        this.setupEventListeners();
        this.render();
    }

    async fetchProducts() {
        try {
            const loadingEl = document.getElementById('loading');
            const errorEl = document.getElementById('error');
            const tableEl = document.getElementById('productTable');

            loadingEl.style.display = 'block';
            errorEl.style.display = 'none';
            tableEl.style.display = 'none';

            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.products = await response.json();
            this.filteredProducts = [...this.products];

            loadingEl.style.display = 'none';
            tableEl.style.display = 'table';
        } catch (error) {
            console.error('Error fetching products:', error);
            document.getElementById('loading').style.display = 'none';
            const errorEl = document.getElementById('error');
            errorEl.style.display = 'block';
            errorEl.textContent = `Lỗi khi tải dữ liệu: ${error.message}`;
        }
    }

    setupEventListeners() {
        // Search by title with onChange (input event)
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Items per page
        document.getElementById('itemsPerPage').addEventListener('change', (e) => {
            this.itemsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.render();
        });

        // Step 4: Sort buttons
        document.querySelectorAll('th.sortable').forEach(th => {
            th.addEventListener('click', () => {
                const column = th.dataset.column;
                this.handleSort(column);
            });
        });
    }

    handleSearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        if (term === '') {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = this.products.filter(product => 
                product.title.toLowerCase().includes(term)
            );
        }

        this.currentPage = 1;
        this.render();
    }

    handleSort(column) {
        // Toggle direction if same column
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        // Sort the filtered products
        this.filteredProducts.sort((a, b) => {
            let valA = a[column];
            let valB = b[column];

            // Handle string comparison for title
            if (column === 'title') {
                valA = valA.toLowerCase();
                valB = valB.toLowerCase();
            }

            if (valA < valB) {
                return this.sortDirection === 'asc' ? -1 : 1;
            }
            if (valA > valB) {
                return this.sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });

        this.updateSortIndicators();
        this.render();
    }

    updateSortIndicators() {
        // Reset all indicators
        document.querySelectorAll('.sort-indicator').forEach(el => {
            el.textContent = '↕';
        });

        // Update current column indicator
        if (this.sortColumn) {
            const indicator = document.getElementById(`sort-${this.sortColumn}`);
            if (indicator) {
                indicator.textContent = this.sortDirection === 'asc' ? '↑' : '↓';
            }
        }
    }

    getPaginatedData() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.filteredProducts.slice(start, end);
    }

    getTotalPages() {
        return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    }

    renderTable() {
        const tbody = document.getElementById('tableBody');
        const paginatedData = this.getPaginatedData();

        tbody.innerHTML = paginatedData.map(product => `
            <tr data-description="${this.escapeHtml(product.description || 'No description available')}">
                <td>${product.id}</td>
                <td>${this.escapeHtml(product.title)}</td>
                <td class="price">$${product.price}</td>
                <td>
                    <span class="category-badge">
                        ${product.category ? this.escapeHtml(product.category.name) : 'N/A'}
                    </span>
                </td>
                <td class="image-cell">
                    <div class="images-container">
                        ${product.images && product.images.length > 0 
                            ? product.images.map(img => `<img src="${img}" alt="Product" onerror="this.style.display='none'">`).join('')
                            : '<span style="color: #999;">No images</span>'
                        }
                    </div>
                </td>
            </tr>
        `).join('');

        // Step 5: Setup hover description tooltip
        this.setupDescriptionTooltip();
    }

    setupDescriptionTooltip() {
        // Create tooltip element if not exists
        let tooltip = document.getElementById('description-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'description-tooltip';
            tooltip.className = 'description-tooltip';
            document.body.appendChild(tooltip);
        }

        // Add hover events to all rows
        document.querySelectorAll('#tableBody tr').forEach(row => {
            row.addEventListener('mouseenter', (e) => {
                const description = row.getAttribute('data-description');
                if (description) {
                    tooltip.innerHTML = '<strong>Description:</strong><br>' + description;
                    tooltip.classList.add('visible');
                    this.positionTooltip(tooltip, e);
                }
            });

            row.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
            });

            row.addEventListener('mousemove', (e) => {
                if (tooltip.classList.contains('visible')) {
                    this.positionTooltip(tooltip, e);
                }
            });
        });
    }

    positionTooltip(tooltip, e) {
        const offset = 15;
        let left = e.clientX + offset;
        let top = e.clientY + offset;

        // Prevent tooltip from going off screen
        const tooltipRect = tooltip.getBoundingClientRect();
        if (left + tooltipRect.width > window.innerWidth) {
            left = e.clientX - tooltipRect.width - offset;
        }
        if (top + tooltipRect.height > window.innerHeight) {
            top = e.clientY - tooltipRect.height - offset;
        }

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

    renderPagination() {
        const paginationEl = document.getElementById('pagination');
        const totalPages = this.getTotalPages();
        
        if (totalPages <= 1) {
            paginationEl.innerHTML = '';
            return;
        }

        let html = '';

        // Previous button
        html += `
            <button onclick="dashboard.goToPage(${this.currentPage - 1})" 
                    ${this.currentPage === 1 ? 'disabled' : ''}>
                ← Prev
            </button>
        `;

        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            html += `<button onclick="dashboard.goToPage(1)">1</button>`;
            if (startPage > 2) {
                html += `<span style="padding: 8px;">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            html += `
                <button onclick="dashboard.goToPage(${i})" 
                        class="${i === this.currentPage ? 'active' : ''}">
                    ${i}
                </button>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                html += `<span style="padding: 8px;">...</span>`;
            }
            html += `<button onclick="dashboard.goToPage(${totalPages})">${totalPages}</button>`;
        }

        // Next button
        html += `
            <button onclick="dashboard.goToPage(${this.currentPage + 1})" 
                    ${this.currentPage === totalPages ? 'disabled' : ''}>
                Next →
            </button>
        `;

        paginationEl.innerHTML = html;
    }

    renderPaginationInfo() {
        const infoEl = document.getElementById('paginationInfo');
        const totalItems = this.filteredProducts.length;
        const totalPages = this.getTotalPages();
        const start = totalItems === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
        const end = Math.min(this.currentPage * this.itemsPerPage, totalItems);

        if (totalItems === 0) {
            infoEl.textContent = 'Không có sản phẩm nào';
        } else {
            infoEl.textContent = `Hiển thị ${start}-${end} của ${totalItems} sản phẩm (Trang ${this.currentPage}/${totalPages})`;
        }
    }

    goToPage(page) {
        const totalPages = this.getTotalPages();
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.render();
        
        // Scroll to top of table
        document.getElementById('productTable').scrollIntoView({ behavior: 'smooth' });
    }

    render() {
        this.renderTable();
        this.renderPagination();
        this.renderPaginationInfo();
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Public function to get all products (exported for external use)
async function getAll() {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

// Initialize dashboard when DOM is loaded
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new ProductDashboard();
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProductDashboard, getAll };
}
