import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const ArrayItemEditor = ({ 
  title, 
  items, 
  onChange, 
  itemTemplate,
  renderItem 
}) => {
  const addItem = () => {
    onChange([...items, { ...itemTemplate }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-lg font-semibold">{title}</Label>
        <Button
          type="button"
          size="sm"
          onClick={addItem}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          <Plus size={16} className="mr-2" />
          Add Item
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <Card key={index} className="p-4 border-l-4 border-l-cyan-600">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-2">
                <GripVertical className="text-slate-400" size={20} />
              </div>
              
              <div className="flex-1 space-y-3">
                {renderItem(item, index, updateItem)}
              </div>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => removeItem(index)}
                className="flex-shrink-0 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </Card>
        ))}

        {items.length === 0 && (
          <div className="text-center py-8 text-slate-500 border-2 border-dashed rounded-lg">
            No items yet. Click "Add Item" to create one.
          </div>
        )}
      </div>
    </div>
  );
};

export default ArrayItemEditor;
