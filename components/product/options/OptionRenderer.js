import ColorSelector from './ColorSelector';
import SizeSelector from './SizeSelector';
import GenericSelector from './GenericSelector';
import { OPTION_TYPES, getOptionConfig } from '@/config/productOptions';

export default function OptionRenderer({ optionType, selectedValue, onValueChange }) {
  const config = getOptionConfig(optionType);
  
  if (!config) {
    console.warn(`Unknown option type: ${optionType}`);
    return null;
  }

  const { label, choices } = config;

  switch (optionType) {
    case OPTION_TYPES.COLOR:
      return (
        <ColorSelector
          colors={choices}
          selectedColor={selectedValue}
          onColorChange={onValueChange}
        />
      );

    case OPTION_TYPES.SIZE:
      return (
        <SizeSelector
          sizes={choices}
          selectedSize={selectedValue}
          onSizeChange={onValueChange}
        />
      );
    case OPTION_TYPES.STORAGE:
    default:
      return (
        <GenericSelector
          label={label}
          options={choices}
          selectedValue={selectedValue}
          onValueChange={onValueChange}
        />
      );
  }
}
