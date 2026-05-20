document.addEventListener('DOMContentLoaded', () => {

    // Pixel animation
    const pixels = document.querySelectorAll('.demo-grid .pixel')
    pixels.forEach((pixel, index) => {
        if (!pixel.classList.contains('invisible')) {
            pixel.style.animation = `pixelAppear 3s ease forwards`
            pixel.style.animationDelay = `${index * 20}ms`
            const colors = ['#2A5230','#D8DAB8', '#5E8F56','#D8DAB8','#B8C48A', '#7FA876', '#9fcb98', '#D8DAB8']
            const randomColor = colors[Math.floor(Math.random() * colors.length)]
            pixel.style.backgroundColor = randomColor
        }
    })

    // Create habit overlay
    const createForm = document.getElementById('create-form')
    const habitOverlay = document.getElementById('habit-overlay')

    document.querySelectorAll('#create-btn, #add-habit-btn, #add-habit-list-btn').forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                if (createForm) createForm.style.display = 'block'
                if (habitOverlay) habitOverlay.classList.add('active')
            })
        }
    })

    const cancelBtn = document.querySelector('.cancel-btn')
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (createForm) createForm.style.display = 'none'
            if (habitOverlay) habitOverlay.classList.remove('active')
        })
    }

    const closeCreate = document.getElementById('close-create')
    if (closeCreate) {
        closeCreate.addEventListener('click', () => {
            if (habitOverlay) habitOverlay.classList.remove('active')
        })
    }

    // Login overlay
    const loginNavBtn = document.getElementById('login-nav-btn')
    if (loginNavBtn) {
        loginNavBtn.addEventListener('click', (e) => {
            e.preventDefault()
            document.getElementById('login-overlay').classList.add('active')
        })
    }

    const closeLogin = document.getElementById('close-login')
    if (closeLogin) {
        closeLogin.addEventListener('click', () => {
            document.getElementById('login-overlay').classList.remove('active')
        })
    }

    // Register overlay
    const registerNavBtn = document.getElementById('register-nav-btn')
    if (registerNavBtn) {
        registerNavBtn.addEventListener('click', (e) => {
            e.preventDefault()
            document.getElementById('register-overlay').classList.add('active')
        })
    }

    const closeRegister = document.getElementById('close-register')
    if (closeRegister) {
        closeRegister.addEventListener('click', () => {
            document.getElementById('register-overlay').classList.remove('active')
        })
    }

    // Switch between login and register
    const switchToRegister = document.getElementById('switch-to-register')
    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault()
            document.getElementById('login-overlay').classList.remove('active')
            document.getElementById('register-overlay').classList.add('active')
        })
    }

    const switchToLogin = document.getElementById('switch-to-login')
    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault()
            document.getElementById('register-overlay').classList.remove('active')
            document.getElementById('login-overlay').classList.add('active')
        })
    }

    // Landing page buttons
    const loginLandingBtn = document.getElementById('login-landing-btn')
    if (loginLandingBtn) {
        loginLandingBtn.addEventListener('click', (e) => {
            e.preventDefault()
            document.getElementById('login-overlay').classList.add('active')
        })
    }

    const registerLandingBtn = document.getElementById('register-landing-btn')
    if (registerLandingBtn) {
        registerLandingBtn.addEventListener('click', (e) => {
            e.preventDefault()
            document.getElementById('register-overlay').classList.add('active')
        })
    }

    // Flash messages
    const flashMessages = document.querySelectorAll('.flash-message')
    flashMessages.forEach(msg => {
        if (msg.textContent.trim() === 'show_login') {
            document.getElementById('login-overlay').classList.add('active')
            msg.style.display = 'none'
        }
        if (msg.textContent.trim() === 'show_register') {
            document.getElementById('register-overlay').classList.add('active')
            msg.style.display = 'none'
        }
    })

    // Edit habit overlay
    const editOverlay = document.getElementById('edit-overlay')
    const closeEdit = document.getElementById('close-edit')

    document.querySelectorAll('.edit').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('edit-habit-id').value = btn.dataset.id
            document.getElementById('edit-name').value = btn.dataset.name
            document.getElementById('edit-description').value = btn.dataset.description
            document.getElementById('edit-unit').value = btn.dataset.unit
            editOverlay.classList.add('active')
        })
    })
    

    // Delete habit overlay
    const deleteOverlay = document.getElementById('delete-overlay')
    const closeDelete = document.getElementById('close-delete')

    if (deleteOverlay && closeDelete) {
        document.querySelectorAll('.delete').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('delete-habit-id').value = btn.dataset.id
                deleteOverlay.classList.add('active')
            })
        })

        closeDelete.addEventListener('click', () => {
            deleteOverlay.classList.remove('active')
        })
    }

    // Nav scroll behavior
    const nav = document.querySelector('nav')
    const landing = document.getElementById('landing')
    if (landing && nav) {
        window.addEventListener('scroll', () => {
            const landingBottom = landing.getBoundingClientRect().bottom
            nav.style.display = landingBottom <= 0 ? 'block' : 'none'
        })
    }

    // log
    const logOverlay = document.getElementById('log-overlay')
    const closeLog = document.getElementById('close-log')

    if (logOverlay && closeLog) {
        document.querySelectorAll('.log').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('log-today-id').value = btn.dataset.id
                document.getElementById('log-habit-name').textContent = btn.dataset.name
                document.getElementById('log-unit').textContent = btn.dataset.unit
                document.getElementById('log-error').textContent = ''
                logOverlay.classList.add('active')
            })
        })
        document.querySelector('#log-overlay form').addEventListener('submit', (e) => {
                const amount = document.getElementById('log-amount').value
                if (isNaN(amount) || amount === ''){
                    document.getElementById('log-error').textContent = "Please insert valid unit value!"
                    e.preventDefault()
                }   
                
        })

        closeLog.addEventListener('click', () => {
            logOverlay.classList.remove('active')
        })
    }


    const tooltip = document.createElement('div')
    tooltip.className = 'pixel-tooltip'
    tooltip.style.display = 'none'
    document.body.appendChild(tooltip)

    document.querySelectorAll('.habit-card .pixel, .total-card .pixel').forEach(pixel => {
        pixel.addEventListener('mouseenter', (e) => {
            const date = pixel.dataset.date
            const quantity = pixel.dataset.quantity
            if (date && quantity !== undefined) {
                tooltip.textContent = `${date} • ${quantity}`
                tooltip.style.display = 'block'
            }
        })
        pixel.addEventListener('mousemove', (e) => {
            tooltip.style.left = (e.clientX + 10) + 'px'
            tooltip.style.top = (e.clientY - 30) + 'px'
        })
        pixel.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none'
        })
    })

    document.querySelectorAll('.habit-scroll').forEach(el => {
    el.scrollLeft = el.scrollWidth
    })

    document.querySelectorAll('.total-scroll').forEach(el => {
    el.scrollLeft = el.scrollWidth
    })

    // Reminder overlay
    const reminderOverlay = document.getElementById('reminder-overlay')
    const closeReminder = document.getElementById('close-reminder')

    if (reminderOverlay && closeReminder) {
        document.querySelectorAll('.reminder').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('reminder-habit-id').value = btn.dataset.id
                document.getElementById('reminder-habit-name').textContent = btn.dataset.name
                document.getElementById('reminder-time-input').value = btn.dataset.time
                reminderOverlay.classList.add('active')

                if (Notification.permission === 'default') {
                    Notification.requestPermission()
                } else if (Notification.permission === 'denied') {
                    alert('Please enable notifications for PixelGebeta in your browser settings to receive reminders!')
                }
            })
        })
        closeReminder.addEventListener('click', () => {
            reminderOverlay.classList.remove('active')
        })
    }

    // Browser notification checker
    function checkReminders() {
        const now = new Date()
        const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0')
        
        document.querySelectorAll('.reminder').forEach(btn => {
            const reminderTime = btn.dataset.time
            const habitName = btn.dataset.name
            if (reminderTime && reminderTime === currentTime) {
                if (Notification.permission === 'granted') {
                    new Notification('PixelGebeta Reminder 🔔', {
                        body: `Time to log your habit: ${habitName}!`,
                        icon: '/static/fire.svg'
                    })
                }
            }
        })
    }

    setInterval(checkReminders, 60000)
    checkReminders()

    const welcomePixels = document.querySelectorAll('.welcome-pixel')
    welcomePixels.forEach((pixel, index) => {
        pixel.style.animation = `pixelAppear 3s ease forwards`
        pixel.style.animationDelay = `${index * 5}ms`
        const colors = ['#2A5230', '#D8DAB8', '#5E8F56', '#D8DAB8', '#B8C48A', '#7FA876', '#9fcb98', '#D8DAB8']
        pixel.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    })

    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible')
            }
        })
    }, { threshold: 0.1 })

    document.querySelectorAll('.habit-card, .total-card, .welcome-card').forEach(card => {
        observer.observe(card)
    })

})