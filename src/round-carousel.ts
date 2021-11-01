import TouchSweep from 'touchsweep';

export type RoundCarouselItem = {
	readonly alt?: string;
	readonly image: string;
	readonly content: HTMLElement;
};

export type RoundCarouselOptions = {
	readonly items: RoundCarouselItem[];
	readonly itemWidth?: number;
	readonly nextButtonContent?: string | HTMLElement;
	readonly prevButtonContent?: string | HTMLElement;
	readonly showControls?: boolean;
};

export class RoundCarousel {
	private element: HTMLElement;
	private touchsweep: TouchSweep | void = undefined;

	private options: RoundCarouselOptions;
	private defaultOptions: RoundCarouselOptions = {
		items: [],
		itemWidth: 210,
		showControls: true,
		prevButtonContent: 'Previous',
		nextButtonContent: 'Next'
	};

	public selectedIndex = 0;

	constructor(element: HTMLElement, options: RoundCarouselOptions) {
		this.element = element;
		this.options = Object.assign({}, this.defaultOptions, options);

		if (!this.element) {
			throw new Error('Carousel element is not defined');
		}

		this.init();
	}

	public init = (): void => {
		this.build();
		this.setStyle();
		this.bind();
	};

	public destroy = (): void => {
		this.unbind();
	};

	public setSelectedIndex = (index: number): void => {
		this.selectedIndex = index;
	};

	public prev = (): void => {
		this.setSelectedIndex(this.selectedIndex - 1);
		this.setStyle();
	};

	public next = (): void => {
		this.setSelectedIndex(this.selectedIndex + 1);
		this.setStyle();
	};

	private getValues = () => {
		const {
			items: { length },
			itemWidth
		} = this.options;

		return {
			theta: 360 / length,
			radius: Math.round((itemWidth || 210) / 2 / Math.tan(Math.PI / length)),
			length
		};
	};

	private getSlideStyle = (index: number): string => {
		const { length, theta, radius } = this.getValues();

		let style = '';

		if (index < length) {
			const cellAngle = theta * index;

			style = `opacity: 1; transform: rotateY(${cellAngle}deg) translateZ(${radius}px);`;
		} else {
			style = 'opacity: 0; transform: none;';
		}

		return style;
	};

	private setStyle = (): void => {
		const { theta, radius } = this.getValues();
		const angle = theta * this.selectedIndex * -1;
		const style = `transform: translateZ(${-1 * radius}px) rotateY(${angle}deg)`;

		this.element?.querySelector('.carousel__container')?.setAttribute('style', style);
	};

	private bind = () => {
		const area = this.element;
		const prevButton = area.querySelector('.carousel__control--prev');
		const nextButton = area.querySelector('.carousel__control--next');

		this.touchsweep = new TouchSweep(area || undefined);

		area?.addEventListener('swipeleft', this.next);
		area?.addEventListener('swiperight', this.prev);

		prevButton?.addEventListener('click', this.prev);
		nextButton?.addEventListener('click', this.next);
	};

	private unbind = () => {
		const area = this.element;
		const prevButton = area.querySelector('.carousel__control--prev');
		const nextButton = area.querySelector('.carousel__control--next');

		if (this.touchsweep) {
			this.touchsweep.unbind();
		}

		area?.removeEventListener('swipeleft', this.next);
		area?.removeEventListener('swiperight', this.prev);

		prevButton?.removeEventListener('click', this.prev);
		nextButton?.removeEventListener('click', this.next);
	};

	private build = () => {
		this.element.innerHTML = `
            <div class="carousel">
                <div class="carousel__container">
                    ${this.buildItems()}
                </div>
            </div>

            ${this.buildControls()}
        `;
	};

	private buildItems = (): string => {
		return this.options.items
			.map(
				(item: RoundCarouselItem, index: number) => `
                    <div class="carousel__slide" style="${this.getSlideStyle(index)}">
                        <img src="${item.image}" alt="${item.alt}" />

                        <div class="carousel__slide-overlay">${item.content}</div>
                    </div>
                `
			)
			.join('');
	};

	private buildControls = (): string => {
		if (!this.options.showControls) {
			return '';
		}

		return `
            <div class="carousel__controls">
                <button class="carousel__control carousel__control--prev">
                    ${this.options.prevButtonContent}
                </button>

                <button class="carousel__control carousel__control--next">
                    ${this.options.nextButtonContent}
                </button>
            </div>
        `;
	};
}

export default RoundCarousel;
