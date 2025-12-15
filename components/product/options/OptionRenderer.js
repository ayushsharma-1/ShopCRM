/**
 * OptionRenderer Component
 * Factory component that renders the appropriate option selector
 * based on option type, using composition over conditionals
 */
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

  // Render specific component based on option type
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

    // Material, Storage, and all future options use GenericSelector
    case OPTION_TYPES.MATERIAL:
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
