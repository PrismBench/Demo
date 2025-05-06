import React from "react";
import { MultiSelect, Group, Button } from "@mantine/core";
import { ModelMeta } from "../../../types/leaderboard";
import styles from "./ModelSelector.module.css";
interface ModelSelectorProps {
  models: ModelMeta[];
  selectedModelIds: string[];
  onChange: (selectedIds: string[]) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModelIds,
  onChange,
}) => {
  const data = models.map((model) => ({
    value: model.id,
    label: model.name,
  }));

  const handleSelectAll = () => {
    const allModelIds = models.map((model) => model.id);
    onChange(allModelIds);
  };

  return (
    <Group gap="md" mb="md" align="flex-end">
      <MultiSelect
        classNames={styles}
        label="Select Models to Compare"
        placeholder="Choose models..."
        data={data}
        value={selectedModelIds}
        onChange={onChange}
        searchable
        clearable
        hidePickedOptions
        comboboxProps={{ shadow: "md" }}
        style={{ flex: 1 }}
      />
      <Button onClick={handleSelectAll} className={styles.selectAllButton}>
        Select All
      </Button>
    </Group>
  );
};

export default ModelSelector;
