import { 
    CardType,
    CountryEnums,
    CountryColorEnums,
    SkillType,
    SkillDots,
    Quality,
    QualityColorEnums
} from '@/interface';

class Card implements CardType {
    id: number;
    name: string;
    image: string;
    countryId: CountryEnums;
    countryName: keyof typeof CountryEnums;
    countryColor: CountryColorEnums;
    skills: SkillType[];
    top: SkillDots;
    bottom: SkillDots;
    left: SkillDots;
    right: SkillDots;
    quality: Quality;
    qualityColor: keyof typeof QualityColorEnums;

    constructor ({ 
        id, 
        name, 
        image,
        countryId,
        countryName,
        countryColor,
        skills,
        top,
        bottom,
        left,
        right,
        quality,
        qualityColor
    } : CardType) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.countryId = countryId;
        this.countryName = countryName;
        this.countryColor = countryColor;
        this.skills = skills;
        this.top = top;
        this.bottom = bottom;
        this.left = left;
        this.right = right;
        this.quality = quality;
        this.qualityColor = qualityColor;
    }
}

export default Card;