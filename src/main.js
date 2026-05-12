import './style.css';
import ProfileCard from './ProfileCard.js';
import Masonry from './Masonry.js';

// Initialize Lucide icons
lucide.createIcons();

// Section Switching Logic
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
let galleryInstance = null;

function switchSection(sectionId) {
    // Update Nav
    navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Update Sections
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.add('active');
            // Refresh masonry layout if active
            if (sectionId === 'gallery' && galleryInstance) {
                setTimeout(() => galleryInstance.layout(), 100);
            }
        } else {
            section.classList.remove('active');
        }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Event Listeners for Nav Links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');
        switchSection(sectionId);

        // Update URL hash without jumping
        history.pushState(null, null, `#${sectionId}`);
    });
});

// Handle initial load with hash
window.addEventListener('load', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) {
        switchSection(hash);
    }
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinksContainer = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    if (navLinksContainer.classList.contains('active')) {
        icon.setAttribute('data-lucide', 'x');
    } else {
        icon.setAttribute('data-lucide', 'menu');
    }
    lucide.createIcons();
});

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.setAttribute('data-lucide', 'menu');
        lucide.createIcons();
    });
});

// Subtle parallax for Hero
const hero = document.querySelector('.hero-overlay');
window.addEventListener('scroll', () => {
    // Disable parallax on mobile for performance
    if (window.innerWidth < 768) return;
    
    const scrolled = window.pageYOffset;
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Initialize Squad Members with ProfileCards
const members = [
    {
        id: 'member1',
        name: 'Alif Adithia',
        title: 'Teknik Informatika',
        handle: 'alif_adithia38',
        status: 'Online',
        avatarUrl: 'https://ik.imagekit.io/lhtvft4ai/alif.jpeg',
        contactUrl: 'https://www.instagram.com/alif_adithia38/'
    },
    {
        id: 'member2',
        name: 'Mhd Hanafi Ginting',
        title: 'Teknik Informatika',
        handle: 'hanakaguu_',
        status: 'Online',
        avatarUrl: 'https://ik.imagekit.io/lhtvft4ai/hanafi.jpg?updatedAt=1775350507214',
        contactUrl: 'https://www.instagram.com/hanakaguu_/'
    },
    {
        id: 'member3',
        name: 'Mhd Widhi Permana',
        title: 'Teknik Informatika',
        handle: 'kim_widhi_',
        status: 'Online',
        avatarUrl: 'https://ik.imagekit.io/lhtvft4ai/widhi.jpeg',
        contactUrl: 'https://www.instagram.com/kim_widhi_/'
    },
    {
        id: 'member4',
        name: 'Angga Pangestu',
        title: 'Teknik Informatika',
        handle: 'anggapngstu_282',
        status: 'Online',
        avatarUrl: 'https://ik.imagekit.io/lhtvft4ai/angga.jpeg',
        contactUrl: 'https://www.instagram.com/anggapngstu_282/'
    },
    {
        id: 'member5',
        name: 'Nababan Andreas Stephanus',
        title: 'Teknik Informatika',
        handle: 'andreasteef',
        status: 'Online',
        avatarUrl: 'https://ik.imagekit.io/lhtvft4ai/andre.jpeg',
        contactUrl: 'https://www.instagram.com/andreasteef/'
    },
    {
        id: 'member6',
        name: 'M. Riski',
        title: 'Teknik Informatika',
        handle: 'mhdriskii22',
        status: 'Online',
        avatarUrl: 'https://ik.imagekit.io/lhtvft4ai/riski.jpeg',
        contactUrl: 'https://www.instagram.com/mhdriskii22/'
    }
];

members.forEach(member => {
    const container = document.getElementById(member.id);
    if (container) {
        new ProfileCard(container, {
            name: member.name,
            title: member.title,
            handle: member.handle,
            status: member.status,
            avatarUrl: member.avatarUrl,
            contactText: 'Lihat',
            contactUrl: member.contactUrl,
            innerGradient: 'linear-gradient(145deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 78, 59, 0.4) 100%)'
        });
    }
});


// Initialize Nobar Logic
const nobarList = document.getElementById('nobarList');
const completedList = document.getElementById('completedList');
const listsContainer = document.getElementById('listsContainer');
const ongoingTitle = document.getElementById('ongoingTitle');
const completedTitle = document.getElementById('completedTitle');
const detailView = document.getElementById('detailView');
const backBtn = document.getElementById('backBtn');
const seriesInfo = document.getElementById('seriesInfo');
const playerFrameContainer = document.getElementById('playerFrameContainer');
const serverTitle = document.getElementById('serverTitle');
const serverListContainer = document.getElementById('serverListContainer');
const episodeListContainer = document.getElementById('episodeListContainer');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

if (backBtn) {
    backBtn.addEventListener('click', () => {
        detailView.style.display = 'none';
        listsContainer.style.display = 'block';
        playerFrameContainer.innerHTML = '';
        playerFrameContainer.style.display = 'none';
    });
}

function renderMovieCards(items, container) {
    container.innerHTML = '';
    if (!items || items.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center;">Donghua tidak ditemukan.</p>';
        return;
    }

    items.slice(0, 16).forEach(item => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        const epBadge = item.current_episode ? `<div class="movie-ep">${item.current_episode}</div>` : '';
        const statusBadge = item.status === 'Completed' ? `<div class="movie-ep" style="background: #ef4444;">Tamat</div>` : epBadge;

        card.innerHTML = `
            <div class="movie-poster-wrap">
                <img src="${item.poster}" alt="${item.title}" class="movie-poster">
                ${statusBadge}
            </div>
            <div class="movie-title">${item.title}</div>
        `;

        card.addEventListener('click', () => {
            if (item.slug) {
                const cleanSlug = item.slug.replace(/\/$/, '');
                loadSeriesDetail(cleanSlug, item.title);
            }
        });
        container.appendChild(card);
    });
}

async function initNobar(query = null) {
    if (!nobarList) return;

    listsContainer.style.display = 'block';
    if (detailView) detailView.style.display = 'none';

    nobarList.innerHTML = `
        <div class="movie-card-skeleton"></div>
        <div class="movie-card-skeleton"></div>
        <div class="movie-card-skeleton"></div>
        <div class="movie-card-skeleton"></div>
    `;

    try {
        if (query) {
            ongoingTitle.style.display = 'none';
            completedTitle.style.display = 'none';
            completedList.style.display = 'none';

            const res = await fetch(`https://www.sankavollerei.com/anime/donghua/search/${encodeURIComponent(query)}`);
            const data = await res.json();
            renderMovieCards(data.data, nobarList);
        } else {
            ongoingTitle.style.display = 'block';
            completedTitle.style.display = 'block';
            completedList.style.display = 'grid';
            completedList.innerHTML = nobarList.innerHTML; // Show skeleton

            // Fetch both concurrently
            const [ongoingRes, completedRes] = await Promise.all([
                fetch('https://www.sankavollerei.com/anime/donghua/ongoing/1'),
                fetch('https://www.sankavollerei.com/anime/donghua/completed/1')
            ]);

            const ongoingData = await ongoingRes.json();
            const completedData = await completedRes.json();

            renderMovieCards(ongoingData.ongoing_donghua, nobarList);
            renderMovieCards(completedData.completed_donghua, completedList);
        }
    } catch (err) {
        console.error('Failed to load Donghua API', err);
        nobarList.innerHTML = '<p style="color: #ef4444; grid-column: 1/-1;">Gagal memuat daftar Donghua.</p>';
        completedList.innerHTML = '';
    }
}

async function loadSeriesDetail(seriesSlug, title) {
    if (!detailView) return;

    listsContainer.style.display = 'none';
    detailView.style.display = 'block';

    seriesInfo.innerHTML = `
        <div style="flex: 1; min-width: 200px; max-width: 250px;">
            <div class="movie-card-skeleton" style="width: 100%; aspect-ratio: 2/3;"></div>
        </div>
        <div style="flex: 2; min-width: 300px;">
            <div class="movie-card-skeleton" style="height: 40px; margin-bottom: 1rem;"></div>
            <div class="movie-card-skeleton" style="height: 20px; width: 50%; margin-bottom: 1rem;"></div>
            <div class="movie-card-skeleton" style="height: 100px;"></div>
        </div>
    `;
    episodeListContainer.innerHTML = '';
    serverTitle.style.display = 'none';
    serverListContainer.innerHTML = '';
    playerFrameContainer.innerHTML = '';
    playerFrameContainer.style.display = 'none';
    lucide.createIcons();
    detailView.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
        const res = await fetch(`https://www.sankavollerei.com/anime/donghua/detail/${seriesSlug}`);
        const data = await res.json();

        seriesInfo.innerHTML = `
            <div style="flex: 1; min-width: 200px; max-width: 250px;">
                <img src="${data.poster}" alt="${data.title}" style="width: 100%; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            </div>
            <div style="flex: 2; min-width: 300px; color: var(--text-main);">
                <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                    <span style="background: rgba(255,255,255,0.1); padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; border: 1px solid rgba(255,255,255,0.2);">${data.type}</span>
                    <span style="background: rgba(255,255,255,0.1); padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; border: 1px solid rgba(255,255,255,0.2);">${data.status}</span>
                </div>
                <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${data.title}</h2>
                <div style="display: flex; gap: 1rem; color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">
                    <span style="display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="tv" style="width: 16px;"></i> ${data.episodes_count}</span>
                    <span style="display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="calendar" style="width: 16px;"></i> ${data.released}</span>
                </div>
                <p style="color: var(--text-muted); line-height: 1.6; margin-bottom: 2rem;">${data.synopsis}</p>
                <button id="startWatchBtn" style="background: linear-gradient(135deg, #d946ef 0%, #ec4899 100%); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: transform 0.2s;">
                    <i data-lucide="play" style="width: 18px; fill: white;"></i> Mulai Menonton
                </button>
            </div>
        `;
        lucide.createIcons();

        if (data.episodes_list && data.episodes_list.length > 0) {
            const episodes = data.episodes_list.reverse();

            // Render episode buttons
            episodes.forEach((ep, index) => {
                const btn = document.createElement('button');
                const epMatch = ep.episode.match(/Episode\s(\d+)/i);
                const epLabel = epMatch ? epMatch[1] : String(index + 1).padStart(2, '0');

                btn.innerText = epLabel;
                btn.style.cssText = `
                    background: transparent; border: 1px solid var(--glass-border); color: var(--text-main);
                    padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;
                    min-width: 50px; font-weight: 500;
                `;
                btn.onmouseover = () => { btn.style.background = 'rgba(255,255,255,0.1)'; };
                btn.onmouseout = () => { if (!btn.classList.contains('active-ep')) btn.style.background = 'transparent'; };

                btn.addEventListener('click', () => {
                    // Update active state
                    Array.from(episodeListContainer.children).forEach(b => {
                        b.style.background = 'transparent';
                        b.style.borderColor = 'var(--glass-border)';
                        b.classList.remove('active-ep');
                    });
                    btn.style.background = 'rgba(236, 72, 153, 0.2)';
                    btn.style.borderColor = '#ec4899';
                    btn.classList.add('active-ep');

                    loadEpisodeStream(ep.slug.replace(/\/$/, ''), ep.episode);
                });

                episodeListContainer.appendChild(btn);
            });

            // Start watching button logic
            document.getElementById('startWatchBtn').addEventListener('click', () => {
                episodeListContainer.children[0].click(); // Click the first episode
            });
        } else {
            throw new Error('No episodes found');
        }
    } catch (err) {
        console.error('Failed to load series details', err);
        seriesInfo.innerHTML = `
            <div style="padding: 2rem; width: 100%; text-align: center; background: rgba(239, 68, 68, 0.1); border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.3);">
                <p style="color: #ef4444;">Gagal memuat detail series.</p>
            </div>
        `;
    }
}

async function loadEpisodeStream(episodeSlug, episodeTitle) {
    playerFrameContainer.style.display = 'block';
    playerFrameContainer.innerHTML = `
        <div style="padding: 4rem 2rem; text-align: center; background: #000; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <i data-lucide="loader-2" class="play-icon spin" style="font-size: 2rem; color: #ec4899;"></i>
            <p style="margin-top: 1rem; color: white;">Memuat ${episodeTitle}...</p>
        </div>
    `;
    serverTitle.style.display = 'none';
    serverListContainer.innerHTML = '';
    lucide.createIcons();
    playerFrameContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

    try {
        const res = await fetch(`https://www.sankavollerei.com/anime/donghua/episode/${episodeSlug}`);
        const data = await res.json();

        if (data.status === 'success' && data.streaming) {
            const servers = data.streaming.servers || [];

            // Function to render iframe
            const renderIframe = (url) => {
                playerFrameContainer.innerHTML = `
                    <div style="width: 100%; position: relative; padding-bottom: 56.25%; border-radius: 12px; overflow: hidden; background: #000; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                        <iframe src="${url}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" allowfullscreen></iframe>
                    </div>
                `;
            };

            // Load main url initially
            if (data.streaming.main_url?.url) {
                renderIframe(data.streaming.main_url.url);
            } else if (servers.length > 0) {
                renderIframe(servers[0].url);
            }

            // Render Server Buttons
            if (servers.length > 0) {
                serverTitle.style.display = 'flex';
                servers.forEach((server, i) => {
                    const btn = document.createElement('button');
                    btn.innerHTML = `<i data-lucide="play" style="width: 14px;"></i> ${server.name}`;
                    btn.style.cssText = `
                        background: transparent; border: 1px solid var(--glass-border); color: var(--text-muted);
                        padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;
                        display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem;
                    `;
                    // Active style for the first server initially
                    if (i === 0) {
                        btn.style.background = 'linear-gradient(135deg, #d946ef 0%, #ec4899 100%)';
                        btn.style.color = 'white';
                        btn.style.borderColor = 'transparent';
                        btn.classList.add('active-server');
                    }

                    btn.addEventListener('click', () => {
                        Array.from(serverListContainer.children).forEach(b => {
                            b.style.background = 'transparent';
                            b.style.color = 'var(--text-muted)';
                            b.style.borderColor = 'var(--glass-border)';
                            b.classList.remove('active-server');
                        });
                        btn.style.background = 'linear-gradient(135deg, #d946ef 0%, #ec4899 100%)';
                        btn.style.color = 'white';
                        btn.style.borderColor = 'transparent';
                        btn.classList.add('active-server');

                        renderIframe(server.url);
                    });
                    serverListContainer.appendChild(btn);
                });
                lucide.createIcons();
            }
        } else {
            throw new Error('Streaming URL not found');
        }
    } catch (err) {
        console.error('Failed to load streaming', err);
        playerFrameContainer.innerHTML = `
            <div style="padding: 2rem; text-align: center; background: rgba(239, 68, 68, 0.1); border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.3);">
                <p style="color: #ef4444;">Gagal memuat video untuk ${episodeTitle}.</p>
            </div>
        `;
    }
}

// Bind search events
if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
        if (searchInput.value.trim()) initNobar(searchInput.value.trim());
    });
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && searchInput.value.trim()) initNobar(searchInput.value.trim());
    });
}

initNobar();

// Initialize Masonry Gallery
const masonryContainer = document.getElementById('masonryContainer');
if (masonryContainer) {
    const masonryItems = [
        {
            id: "1",
            img: "https://ik.imagekit.io/uch3hpxqn/pic%20gallery/pic%20random/WhatsApp%20Image%202026-05-11%20at%2000.21.34%20(1).jpeg?updatedAt=1778518601047",
            url: "#",
            height: 400
        },
        {
            id: "2",
            img: "https://ik.imagekit.io/uch3hpxqn/pic%20gallery/pic%20random/WhatsApp%20Image%202026-05-11%20at%2000.21.30%20(1).jpeg?updatedAt=1778518597406",
            url: "#",
            height: 300
        },
        {
            id: "3",
            img: "https://ik.imagekit.io/uch3hpxqn/pic%20gallery/pic%20random/WhatsApp%20Image%202026-05-11%20at%2000.21.31%20(1).jpeg?updatedAt=1778518597799",
            url: "#",
            height: 500
        },
        {
            id: "4",
            img: "https://ik.imagekit.io/uch3hpxqn/pic%20gallery/pic%20random/WhatsApp%20Image%202026-05-11%20at%2000.21.40.jpeg?updatedAt=1778518592389",
            url: "#",
            height: 220
        },
        {
            id: "5",
            img: "https://ik.imagekit.io/uch3hpxqn/pic%20gallery/pic%20random/WhatsApp%20Image%202026-05-11%20at%2000.21.27.jpeg?updatedAt=1778518589403",
            url: "#",
            height: 450
        },
        {
            id: "6",
            img: "https://ik.imagekit.io/uch3hpxqn/pic%20gallery/pic%20random/WhatsApp%20Image%202026-05-11%20at%2000.21.34%20(2).jpeg?updatedAt=1778518590247",
            url: "#",
            height: 220
        },
        
        {
            id: "7",
            img: "https://ik.imagekit.io/uch3hpxqn/pic%20gallery/pic%20random/WhatsApp%20Image%202026-05-11%20at%2000.21.39%20(1).jpeg?updatedAt=1778518600456",
            url: "#",
            height: 220
        },
        {
            id: "8",
            img: "https://ik.imagekit.io/uch3hpxqn/pic%20gallery/pic%20random/WhatsApp%20Image%202026-05-11%20at%2000.21.39.jpeg?updatedAt=1778518600417",
            url: "#",
            height: 220
        },
        {
            id: "9",
            img: "https://ik.imagekit.io/uch3hpxqn/pic%20gallery/pic%20random/WhatsApp%20Image%202026-05-11%20at%2000.21.41.jpeg?updatedAt=1778518599812",
            url: "#",
            height: 320
        },
        {
            id: "10",
            img: "https://ik.imagekit.io/uch3hpxqn/pic%20gallery/pic%20random/WhatsApp%20Image%202026-05-11%20at%2000.21.38.jpeg?updatedAt=1778518598982",
            url: "#",
            height: 450
        },
        {
            id: "11",
            img: "https://ik.imagekit.io/uch3hpxqn/pic%20gallery/pic%20random/WhatsApp%20Image%202026-05-11%20at%2000.21.38%20(1).jpeg?updatedAt=1778518598403",
            url: "#",
            height: 450
        },
        {
            id: "12",
            img: "https://ik.imagekit.io/uch3hpxqn/pic%20gallery/pic%20random/WhatsApp%20Image%202026-05-11%20at%2000.21.31%20(1).jpeg?updatedAt=1778518597799",
            url: "#",
            height: 450
        },
        {
            id: "13",
            img: "https://ik.imagekit.io/uch3hpxqn/pic%20gallery/pic%20random/WhatsApp%20Image%202026-05-11%20at%2000.21.36%20(2).jpeg?updatedAt=1778518597275",
            url: "#",
            height: 250
        },
        {
            id: "14",
            img: "https://ik.imagekit.io/uch3hpxqn/pic%20gallery/pic%20random/WhatsApp%20Image%202026-05-11%20at%2000.21.30%20(1).jpeg?updatedAt=1778518597406",
            url: "#",
            height: 450
        },
        {
            id: "15",
            img: "https://ik.imagekit.io/uch3hpxqn/pic%20gallery/pic%20random/WhatsApp%20Image%202026-05-11%20at%2000.21.37.jpeg?updatedAt=1778518595620",
            url: "#",
            height: 470
        },
        {
            id: "16",
            img: "https://ik.imagekit.io/uch3hpxqn/pic%20gallery/pic%20random/WhatsApp%20Image%202026-05-11%20at%2000.21.25%20(1).jpeg?updatedAt=1778518594877",
            url: "#",
            height: 470
        },
        {
            id: "17",
            img: "https://ik.imagekit.io/uch3hpxqn/pic%20gallery/pic%20random/WhatsApp%20Image%202026-05-11%20at%2000.21.37%20(1).jpeg?updatedAt=1778518591010",
            url: "#",
            height: 220
        },
        {
            id: "18",
            img: "https://ik.imagekit.io/uch3hpxqn/pic%20gallery/pic%20random/WhatsApp%20Image%202026-05-11%20at%2000.21.30.jpeg?updatedAt=1778518590730",
            url: "#",
            height: 220
        },
        {
            id: "19",
            img: "https://ik.imagekit.io/uch3hpxqn/pic%20gallery/pic%20random/WhatsApp%20Image%202026-05-11%20at%2000.21.35.jpeg?updatedAt=1778518590439",
            url: "#",
            height: 450
        },
        {
            id: "20",
            img: "https://ik.imagekit.io/uch3hpxqn/pic%20gallery/pic%20random/WhatsApp%20Image%202026-05-11%20at%2000.21.31.jpeg?updatedAt=1778518588647",
            url: "#",
            height: 400
        },
        {
            id: "21",
            img: "https://ik.imagekit.io/uch3hpxqn/pic%20gallery/pic%20random/WhatsApp%20Image%202026-05-11%20at%2000.21.35%20(1).jpeg?updatedAt=1778518588624",
            url: "#",
            height: 450
        },
        {
            id: "22",
            img: "https://ik.imagekit.io/uch3hpxqn/pic%20gallery/pic%20random/WhatsApp%20Image%202026-05-11%20at%2000.21.27%20(1).jpeg?updatedAt=1778518588419",
            url: "#",
            height: 250
        },
        {
            id: "23",
            img: "https://ik.imagekit.io/uch3hpxqn/pic%20gallery/pic%20random/WhatsApp%20Image%202026-05-11%20at%2000.21.26.jpeg?updatedAt=1778518587496",
            url: "#",
            height: 250
        },
        {
            id: "24",
            img: "https://ik.imagekit.io/uch3hpxqn/pic%20gallery/pic%20random/WhatsApp%20Image%202026-05-11%20at%2000.21.25.jpeg?updatedAt=1778518585984",
            url: "#",
            height: 450
        },
        {
            id: "25",
            img: "https://ik.imagekit.io/uch3hpxqn/pic%20gallery/pic%20random/WhatsApp%20Image%202026-05-11%20at%2000.21.36%20(1).jpeg?updatedAt=1778518586695",
            url: "#",
            height: 450
        },

    ];

    galleryInstance = new Masonry(masonryContainer, {
        items: masonryItems,
        ease: "power3.out",
        duration: 0.6,
        stagger: 0.05,
        animateFrom: "bottom",
        scaleOnHover: true,
        hoverScale: 0.95,
        blurToFocus: true,
        colorShiftOnHover: false
    });
}

// ==========================================
// Comic Library Logic
// ==========================================
const comicListContainer = document.getElementById('comicListContainer');
const comicListView = document.getElementById('comicListView');
const comicReaderView = document.getElementById('comicReaderView');
const comicBackBtn = document.getElementById('comicBackBtn');
const comicChapterTitle = document.getElementById('comicChapterTitle');
const comicImagesContainer = document.getElementById('comicImagesContainer');
const comicSearchInput = document.getElementById('comicSearchInput');
const comicSearchBtn = document.getElementById('comicSearchBtn');

const comicPrevBtn = document.getElementById('comicPrevBtn');
const comicNextBtn = document.getElementById('comicNextBtn');
const comicPrevBtnBottom = document.getElementById('comicPrevBtnBottom');
const comicNextBtnBottom = document.getElementById('comicNextBtnBottom');

// New Detail View Elements
const comicDetailView = document.getElementById('comicDetailView');
const comicDetailContent = document.getElementById('comicDetailContent');
const comicDetailBackBtn = document.getElementById('comicDetailBackBtn');

async function initComicLibrary(query = null) {
    if (!comicListContainer) return;

    comicListView.style.display = 'block';
    if (comicReaderView) comicReaderView.style.display = 'none';
    if (comicDetailView) comicDetailView.style.display = 'none';

    comicListContainer.innerHTML = `
        <div class="movie-card-skeleton" style="height: 300px;"></div>
        <div class="movie-card-skeleton" style="height: 300px;"></div>
        <div class="movie-card-skeleton" style="height: 300px;"></div>
        <div class="movie-card-skeleton" style="height: 300px;"></div>
    `;

    try {
        let apiUrl = 'https://www.sankavollerei.com/comic/kiryuu/home';
        if (query) {
            apiUrl = `https://www.sankavollerei.com/comic/kiryuu/search/${encodeURIComponent(query)}`;
        }

        const res = await fetch(apiUrl);
        const data = await res.json();

        // Ensure success
        if (!data.success) throw new Error("API failed");

        const items = query ? data.seriesList : (data.trending || data.latestUpdates || []);

        comicListContainer.innerHTML = '';
        if (!items || items.length === 0) {
            comicListContainer.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center;">Komik tidak ditemukan.</p>';
            return;
        }

        items.slice(0, 16).forEach(item => {
            const card = document.createElement('div');
            card.className = 'movie-card';

            // Try to extract image, if it's the SVG placeholder, use gradient fallback
            const imageSrc = (item.imageSrc || item.image);
            const isPlaceholder = imageSrc && imageSrc.includes('data:image/svg+xml');

            // Generate gradient colors for fallback
            const colors = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
            const charCode = item.title.charCodeAt(0) || 0;
            const color1 = colors[charCode % colors.length];
            const color2 = colors[(charCode + 2) % colors.length];
            const gradientFallback = `
                <div class="movie-poster" style="background: linear-gradient(135deg, ${color1}, ${color2}); display: flex; align-items: center; justify-content: center; text-align: center; padding: 1rem; height: 100%;">
                    <h3 style="color: white; font-size: 1.2rem; font-weight: 700; text-shadow: 0 2px 10px rgba(0,0,0,0.5); margin: 0; line-height: 1.4;">
                        ${item.title.split(' ').slice(0, 4).join('<br>')}
                    </h3>
                </div>
            `;

            let posterHtml = '';
            if (isPlaceholder || !imageSrc) {
                posterHtml = gradientFallback;
            } else {
                // Proxy images through wsrv.nl to bypass hotlink protection
                const proxiedSrc = `https://wsrv.nl/?url=${encodeURIComponent(imageSrc)}&w=300&h=400&fit=cover`;
                posterHtml = `<img src="${proxiedSrc}" alt="${item.title}" class="movie-poster">`;
            }

            const ratingBadge = item.rating ? `<div style="position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 3px 8px; border-radius: 6px; font-size: 0.75rem; color: #fbbf24; font-weight: 600; display: flex; align-items: center; gap: 3px; z-index: 2;">⭐ ${item.rating}</div>` : '';

            card.innerHTML = `
                <div class="movie-poster-wrap">
                    ${posterHtml}
                    ${ratingBadge}
                    <div class="movie-ep" style="background: var(--primary-color);">${item.latestChapter || (item.chapters && item.chapters[0] ? item.chapters[0].title : 'Ch. 1')}</div>
                </div>
                <div class="movie-title">${item.title}</div>
            `;

            // Attach onerror fallback for images that fail to load
            const imgEl = card.querySelector('img.movie-poster');
            if (imgEl) {
                imgEl.onerror = function() {
                    const wrap = this.closest('.movie-poster-wrap');
                    if (wrap) {
                        // Replace img with gradient fallback
                        const fallbackDiv = document.createElement('div');
                        fallbackDiv.className = 'movie-poster';
                        fallbackDiv.style.cssText = `background: linear-gradient(135deg, ${color1}, ${color2}); display: flex; align-items: center; justify-content: center; text-align: center; padding: 1rem; height: 100%;`;
                        fallbackDiv.innerHTML = `<h3 style="color: white; font-size: 1.2rem; font-weight: 700; text-shadow: 0 2px 10px rgba(0,0,0,0.5); margin: 0; line-height: 1.4;">${item.title.split(' ').slice(0, 4).join('<br>')}</h3>`;
                        this.replaceWith(fallbackDiv);
                    }
                };
            }

            card.addEventListener('click', () => {
                loadComicDetail(item.slug);
            });

            comicListContainer.appendChild(card);
        });
    } catch (err) {
        console.error('Failed to load Comic API', err);
        comicListContainer.innerHTML = '<p style="color: #ef4444; grid-column: 1/-1;">Gagal memuat daftar Komik.</p>';
    }
}

async function loadComicDetail(slug) {
    if (!comicDetailView || !comicListView) return;

    comicListView.style.display = 'none';
    comicReaderView.style.display = 'none';
    comicDetailView.style.display = 'block';

    comicDetailContent.innerHTML = `
        <div style="padding: 4rem 2rem; text-align: center;">
            <i data-lucide="loader-2" class="play-icon spin" style="font-size: 2rem; color: var(--primary-color);"></i>
        </div>
    `;
    lucide.createIcons();
    comicDetailView.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
        // We use komikstation for details as it has a more standard slug structure
        const res = await fetch(`https://www.sankavollerei.com/comic/komikstation/manga/${slug}`);
        const data = await res.json();

        if (!data.success) throw new Error("Failed to load detail");

        const proxiedPoster = `https://wsrv.nl/?url=${encodeURIComponent(data.imageSrc)}&w=400&h=600&fit=cover`;

        comicDetailContent.innerHTML = `
            <div style="display: grid; grid-template-columns: 300px 1fr; gap: 2rem; margin-bottom: 3rem; flex-wrap: wrap;">
                <div class="detail-poster-container" style="position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                    <img src="${proxiedPoster}" style="width: 100%; display: block;" alt="${data.title}">
                    <div style="position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); padding: 5px 12px; border-radius: 8px; font-weight: 700; color: #fbbf24; display: flex; align-items: center; gap: 5px;">
                        ⭐ ${data.rating || 'N/A'}
                    </div>
                </div>
                <div class="detail-info">
                    <h2 style="color: white; font-size: 2rem; margin-bottom: 0.5rem; line-height: 1.2;">${data.title}</h2>
                    <p style="color: var(--text-muted); margin-bottom: 1.5rem; font-size: 0.9rem;">${data.alternative || ''}</p>
                    
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
                        ${data.genres.map(g => `<span style="background: rgba(255,255,255,0.05); color: var(--text-muted); padding: 4px 12px; border-radius: 100px; font-size: 0.8rem; border: 1px solid var(--glass-border);">${g.name}</span>`).join('')}
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; background: rgba(255,255,255,0.02); padding: 1rem; border-radius: 12px;">
                        <div>
                            <span style="display: block; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Status</span>
                            <span style="color: var(--primary-color); font-weight: 600;">${data.status || 'Ongoing'}</span>
                        </div>
                        <div>
                            <span style="display: block; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Type</span>
                            <span style="color: white; font-weight: 600;">${data.type || 'Manhwa'}</span>
                        </div>
                        <div>
                            <span style="display: block; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Author</span>
                            <span style="color: white; font-weight: 600;">${data.author || '-'}</span>
                        </div>
                        <div>
                            <span style="display: block; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Update</span>
                            <span style="color: white; font-weight: 600;">${data.updatedOn || '-'}</span>
                        </div>
                    </div>

                    <div style="margin-top: 1.5rem;">
                        <h4 style="color: white; margin-bottom: 0.5rem; font-size: 1rem;">Sinopsis</h4>
                        <p style="color: var(--text-muted); line-height: 1.6; font-size: 0.95rem; max-height: 200px; overflow-y: auto;">${data.synopsis}</p>
                    </div>
                </div>
            </div>

            <div class="chapter-list-section">
                <h3 style="color: white; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem; font-size: 1.25rem;">
                    <i data-lucide="list-ordered" style="color: var(--primary-color);"></i> Daftar Chapter
                </h3>
                <div class="chapter-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.75rem; max-height: 500px; overflow-y: auto; padding-right: 10px;">
                    ${data.chapters.map(ch => `
                        <div class="chapter-item" data-slug="${ch.slug}" style="background: var(--glass-bg); border: 1px solid var(--glass-border); padding: 0.75rem; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; text-align: center;">
                            <div style="color: white; font-weight: 500; font-size: 0.9rem;">${ch.title}</div>
                            <div style="color: var(--text-muted); font-size: 0.7rem; margin-top: 3px;">${ch.date}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        lucide.createIcons();

        // Add chapter click events
        comicDetailContent.querySelectorAll('.chapter-item').forEach(item => {
            item.addEventListener('click', () => {
                loadComicChapter(item.getAttribute('data-slug'));
            });
            // Hover effect
            item.addEventListener('mouseenter', () => {
                item.style.background = 'rgba(255,255,255,0.1)';
                item.style.borderColor = 'var(--primary-color)';
                item.style.transform = 'translateY(-2px)';
            });
            item.addEventListener('mouseleave', () => {
                item.style.background = 'var(--glass-bg)';
                item.style.borderColor = 'var(--glass-border)';
                item.style.transform = 'translateY(0)';
            });
        });

    } catch (err) {
        console.error("Detail Error:", err);
        comicDetailContent.innerHTML = `<p style="color: #ef4444; text-align: center;">Gagal memuat detail komik.</p>`;
    }
}

async function loadComicChapter(chapterSlug) {
    if (!comicReaderView || !comicListView) return;

    comicListView.style.display = 'none';
    if (comicDetailView) comicDetailView.style.display = 'none';
    comicReaderView.style.display = 'block';

    comicChapterTitle.innerText = "Memuat...";
    comicImagesContainer.innerHTML = `
        <div style="padding: 4rem 2rem; text-align: center;">
            <i data-lucide="loader-2" class="play-icon spin" style="font-size: 2rem; color: var(--primary-color);"></i>
        </div>
    `;
    lucide.createIcons();
    comicReaderView.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Disable buttons initially
    [comicPrevBtn, comicNextBtn, comicPrevBtnBottom, comicNextBtnBottom].forEach(btn => btn.disabled = true);

    try {
        const res = await fetch(`https://www.sankavollerei.com/comic/komikstation/chapter/${chapterSlug}`);
        const data = await res.json();

        if (data.success && data.images) {
            comicChapterTitle.innerText = data.title || "Chapter Reader";
            comicImagesContainer.innerHTML = '';

            // Render images
            data.images.forEach((imgUrl, index) => {
                const img = document.createElement('img');
                // Proxy chapter images too
                const proxiedImg = `https://wsrv.nl/?url=${encodeURIComponent(imgUrl)}`;
                img.src = proxiedImg;
                img.alt = `Page ${index + 1}`;
                img.style.cssText = `
                    max-width: 100%;
                    width: 100%;
                    display: block;
                    margin: 0;
                    min-height: 200px;
                    background: #111;
                `;
                img.loading = "lazy";
                
                // Fallback for chapter images
                img.onerror = function() {
                    this.src = imgUrl; // try original if proxy fails
                    this.onerror = null;
                };

                comicImagesContainer.appendChild(img);
            });

            // Handle Pagination
            const handleNav = (slug) => {
                if (slug) {
                    loadComicChapter(slug);
                }
            };

            if (data.prevSlug) {
                [comicPrevBtn, comicPrevBtnBottom].forEach(btn => {
                    btn.disabled = false;
                    btn.onclick = () => handleNav(data.prevSlug);
                });
            }
            if (data.nextSlug) {
                [comicNextBtn, comicNextBtnBottom].forEach(btn => {
                    btn.disabled = false;
                    btn.onclick = () => handleNav(data.nextSlug);
                });
            }

        } else {
            throw new Error('Chapter data not found');
        }
    } catch (err) {
        console.error('Failed to load chapter', err);
        comicImagesContainer.innerHTML = `
            <div style="padding: 2rem; text-align: center; background: rgba(239, 68, 68, 0.1); border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.3); margin-top: 2rem;">
                <p style="color: #ef4444;">Gagal memuat chapter.</p>
            </div>
        `;
        comicChapterTitle.innerText = "Error";
    }
}

if (comicBackBtn) {
    comicBackBtn.addEventListener('click', () => {
        comicReaderView.style.display = 'none';
        // Go back to detail if we have content, else to list
        if (comicDetailContent.innerHTML.trim() !== '') {
            comicDetailView.style.display = 'block';
            comicDetailView.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            comicListView.style.display = 'block';
            document.getElementById('library').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        comicImagesContainer.innerHTML = '';
    });
}

if (comicDetailBackBtn) {
    comicDetailBackBtn.addEventListener('click', () => {
        comicDetailView.style.display = 'none';
        comicListView.style.display = 'block';
        document.getElementById('library').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

// Bind search events for comics
if (comicSearchBtn && comicSearchInput) {
    comicSearchBtn.addEventListener('click', () => {
        if (comicSearchInput.value.trim()) initComicLibrary(comicSearchInput.value.trim());
    });
    comicSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && comicSearchInput.value.trim()) initComicLibrary(comicSearchInput.value.trim());
    });
}

// Init on load
initComicLibrary();

console.log('Butterfly Initialized 🚀');
