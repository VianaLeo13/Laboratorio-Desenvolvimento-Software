// Gerenciamento do vídeo de fundo para páginas de login e cadastro
class VideoBackgroundManager {
    constructor() {
        this.video = null;
        this.hasLoaded = false;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupVideo();
        });
    }

    setupVideo() {
        this.video = document.querySelector('.video-background video');
        
        if (!this.video) {
            console.warn('Vídeo de fundo não encontrado');
            return;
        }

        // Configurações do vídeo
        this.video.muted = true;
        this.video.loop = true;
        this.video.autoplay = true;
        this.video.playsInline = true;

        // Event listeners
        this.video.addEventListener('loadeddata', () => {
            console.log('✅ Vídeo carregado com sucesso!');
            this.hasLoaded = true;
            this.video.style.opacity = '1';
        });

        this.video.addEventListener('loadedmetadata', () => {
            console.log('📹 Metadados do vídeo carregados');
        });

        this.video.addEventListener('canplay', () => {
            console.log('▶️ Vídeo pronto para reproduzir');
            this.playVideo();
        });

        this.video.addEventListener('error', (e) => {
            console.error('❌ Erro ao carregar vídeo:', e);
            console.error('Detalhes do erro:', this.video.error);
            this.handleVideoError();
        });

        this.video.addEventListener('stalled', () => {
            console.warn('⏸️ Vídeo pausado por buffering');
        });

        // Tentar carregar o vídeo
        this.loadVideo();
    }

    loadVideo() {
        if (!this.video) return;

        // Lista de possíveis caminhos para o vídeo
        const videoPaths = [
            'imagens/Time Lapse - PUC Minas Coração Eucarístico.mp4',
            'imagens/time lapse.mp4',
            'imagens/timelapse.mp4',
            'imagens/video.mp4'
        ];

        this.tryVideoPath(videoPaths, 0);
    }

    tryVideoPath(paths, index) {
        if (index >= paths.length) {
            console.error('❌ Nenhum vídeo encontrado nos caminhos testados');
            this.handleVideoError();
            return;
        }

        const path = paths[index];
        console.log(`🔍 Tentando carregar vídeo: ${path}`);

        // Criar novo elemento source
        const source = document.createElement('source');
        source.src = path;
        source.type = 'video/mp4';

        // Limpar sources existentes
        const existingSources = this.video.querySelectorAll('source');
        existingSources.forEach(s => s.remove());

        // Adicionar novo source
        this.video.appendChild(source);

        // Tentar carregar
        this.video.load();

        // Timeout para tentar próximo caminho se não carregar
        setTimeout(() => {
            if (!this.hasLoaded) {
                console.warn(`⚠️ Timeout para ${path}, tentando próximo...`);
                this.tryVideoPath(paths, index + 1);
            }
        }, 3000);
    }

    playVideo() {
        if (!this.video) return;

        this.video.play().then(() => {
            console.log('✅ Vídeo iniciado com sucesso!');
        }).catch(error => {
            console.log('⚠️ Autoplay bloqueado pelo navegador:', error);
            
            // Tentar novamente quando o usuário interagir com a página
            const playOnInteraction = () => {
                this.video.play().then(() => {
                    console.log('✅ Vídeo iniciado após interação do usuário!');
                    document.removeEventListener('click', playOnInteraction);
                    document.removeEventListener('touchstart', playOnInteraction);
                }).catch(e => console.error('❌ Erro ao iniciar vídeo:', e));
            };

            document.addEventListener('click', playOnInteraction, { once: true });
            document.addEventListener('touchstart', playOnInteraction, { once: true });
        });
    }

    handleVideoError() {
        console.warn('🎨 Aplicando fallback visual...');
        
        // Remover vídeo com erro
        const videoContainer = document.querySelector('.video-background');
        if (videoContainer) {
            videoContainer.style.display = 'none';
        }

        // Aplicar background alternativo
        document.body.style.background = `
            linear-gradient(135deg, 
                rgba(255, 184, 0, 0.8) 0%, 
                rgba(255, 215, 0, 0.6) 25%,
                rgba(26, 32, 44, 0.7) 50%,
                rgba(74, 85, 104, 0.8) 75%,
                rgba(45, 55, 72, 0.9) 100%
            )
        `;

        // Adicionar padrão animado
        this.addAnimatedPattern();
    }

    addAnimatedPattern() {
        const style = document.createElement('style');
        style.textContent = `
            body.video-bg::after {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle at 20% 80%, rgba(255, 184, 0, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%);
                animation: float 6s ease-in-out infinite;
                z-index: -1;
            }

            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(180deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Inicializar quando o script for carregado
new VideoBackgroundManager();
