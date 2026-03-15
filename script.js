document.addEventListener('DOMContentLoaded', function() {
    drawConnectors();
    addInteractions();
    
    // Debounced resize handler for better performance
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            drawConnectors();
        }, 250); // Wait 250ms after resize ends
    });
    
    // Check for orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(drawConnectors, 100);
    });
});

function addInteractions() {
    // Node clicks
    document.querySelectorAll('.orbit-node').forEach(node => {
        node.addEventListener('click', function(e) {
            e.stopPropagation();
            const tool = this.getAttribute('data-tool');
            
            // Different messages for mobile vs desktop
            const isMobile = window.innerWidth <= 768;
            const message = isMobile ? `📱 ${tool}` : `🚀 ${tool} - Ready for deployment!`;
            
            showNotification(message);
            
            this.style.transform = 'scale(1.3)';
            setTimeout(() => this.style.transform = '', 300);
        });
    });

    // Core click
    const core = document.getElementById('awsCore');
    if (core) {
        core.addEventListener('click', function() {
            const isMobile = window.innerWidth <= 768;
            const message = isMobile ? '☁️ AWS Cloud' : '☁️ AWS Cloud - Your infrastructure hub!';
            
            showNotification(message);
            
            document.querySelectorAll('.orbit-node').forEach(node => {
                node.style.transform = 'scale(1.2)';
                setTimeout(() => node.style.transform = '', 500);
            });
        });
    }
}

function drawConnectors() {
    const svg = document.getElementById('orbitalSvg');
    const wrapper = document.getElementById('orbitalWrapper');
    const core = document.querySelector('.orbit-core');
    const nodes = document.querySelectorAll('.orbit-node');
    
    if (!svg || !wrapper || !core || !nodes.length) return;
    
    svg.innerHTML = '';
    
    const wrapperRect = wrapper.getBoundingClientRect();
    if (wrapperRect.width === 0) return;
    
    svg.setAttribute('viewBox', `0 0 ${wrapperRect.width} ${wrapperRect.height}`);
    svg.setAttribute('preserveAspectRatio', 'none'); // Better scaling
    
    const coreRect = core.getBoundingClientRect();
    const centerX = coreRect.left + coreRect.width / 2 - wrapperRect.left;
    const centerY = coreRect.top + coreRect.height / 2 - wrapperRect.top;
    
    // Responsive line thickness
    const lineThickness = Math.max(1, Math.min(1.5, wrapperRect.width / 300));
    
    const colors = ['#6d93d6', '#ffb870', '#7aa6ff', '#f3a953', '#a78bfa', '#f472b6', '#2496ed', '#844fba'];
    
    nodes.forEach((node, index) => {
        const nodeRect = node.getBoundingClientRect();
        const nodeX = nodeRect.left + nodeRect.width / 2 - wrapperRect.left;
        const nodeY = nodeRect.top + nodeRect.height / 2 - wrapperRect.top;
        
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute('x1', centerX);
        line.setAttribute('y1', centerY);
        line.setAttribute('x2', nodeX);
        line.setAttribute('y2', nodeY);
        line.setAttribute('stroke', colors[index % colors.length]);
        line.setAttribute('stroke-width', lineThickness.toString());
        line.setAttribute('stroke-dasharray', '5,5');
        line.setAttribute('opacity', '0.4');
        
        // Only add animation on non-mobile devices for performance
        if (window.innerWidth > 768) {
            const animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            animate.setAttribute('attributeName', 'stroke-dashoffset');
            animate.setAttribute('values', '0;50');
            animate.setAttribute('dur', '3s');
            animate.setAttribute('repeatCount', 'indefinite');
            line.appendChild(animate);
        }
        
        svg.appendChild(line);
    });
}

function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.orbital-notification');
    if (existing) existing.remove();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'orbital-notification';
    
    // Responsive positioning
    const isMobile = window.innerWidth <= 768;
    
    notification.style.cssText = `
        position: fixed;
        top: ${isMobile ? 'auto' : '20px'};
        bottom: ${isMobile ? '20px' : 'auto'};
        right: 20px;
        left: ${isMobile ? '20px' : 'auto'};
        background: #1e2f4a;
        color: white;
        padding: ${isMobile ? '0.8rem 1rem' : '1rem 2rem'};
        border-radius: 50px;
        border-left: 4px solid #ffb870;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        font-family: 'Inter', sans-serif;
        font-size: ${isMobile ? '0.9rem' : '1rem'};
        text-align: center;
        max-width: ${isMobile ? 'calc(100% - 40px)' : '300px'};
    `;
    
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add animation styles if not present
if (!document.querySelector('#orbital-animation-styles')) {
    const style = document.createElement('style');
    style.id = 'orbital-animation-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @media (max-width: 768px) {
            @keyframes slideIn {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateY(0); opacity: 1; }
                to { transform: translateY(100%); opacity: 0; }
            }
        }
    `;
    document.head.appendChild(style);
}
