<?php
/**
 * Magiccart 
 * @category 	Magiccart 
 * @copyright 	Copyright (c) 2014 Magiccart (http://www.magiccart.net/) 
 * @license 	http://www.magiccart.net/license-agreement.html
 * @Author: DOng NGuyen<nguyen@dvn.com>
 * @@Create Date: 2014-04-14 15:31:56
 * @@Modify Date: 2014-11-22 22:47:05
 * @@Function:
 */
?>
<?php
class Magiccart_Magiccategory_Block_Widget_Magiccategory extends Mage_Core_Block_Template implements Mage_Widget_Block_Interface
{

    public function getGeneralCfg($cfg)
    {
        return Mage::helper('magiccategory')->getGeneralCfg($cfg);
    }

    public function getProductCfg()
    {

        $options = array('limit', 'productDelay', 'widthImages', 'heightImages', 'action', 'types');
        $ajax = array();
        foreach ($options as $option) {
            $ajax[$option] = $this->getData($option);
        }
        return $ajax;
    }

    public function getTabActive()
    {
        $active = $this->getActive(); // get form Widget
        $tabs = $this->getTabs();
        $types = array_keys($tabs);
        if(!in_array($active, $types)){
            $active = $types[0];            
        }
        return $active;
    }

    public function getContentActive($template)
    {
        if(!$this->getTabActive()) return;
        return $this->getLayout()
               ->createBlock('magiccategory/product_grid')
               ->setActive($this->getTabActive()) //or ->setData('active', $this->getTabActive())
               ->setCfg($this->getData())
               ->setTemplate($template)
               ->toHtml();
    }

    public function getTabs()
    {
        $cfg = $this->getCategoryIds();
        $categoryIds = explode(',', $cfg);
        $tabs = array();
        $types =  Mage::getModel('catalog/category')->getCollection()
                        ->addAttributeToFilter('entity_id', array('in' => $categoryIds))
                        ->addAttributeToSelect('name');
        foreach ($types as $type) {
            $tabs[$type->getEntityId()] = $type->getName();
        }

        return $tabs;
    }

    public function getDevices()
    {
        $devices = array('portrait'=>480, 'landscape'=>640, 'tablet'=>768, 'desktop'=>992);
        return $devices;
    }

    public function getItemsDevice()
    {
        $screens = $this->getDevices();
        $screens['visibleItems']  = 993;
        $itemOnDevice = array();
        // $itemOnDevice['320'] = '1';
        foreach ($screens as $screen => $size) {
            // $fn = 'get'.ucfirst($screen);
            // $itemOnDevice[$size] = $this->{$fn}();
            $itemOnDevice[$size] = $this->getData($screen);
        }
        return $itemOnDevice;
    }

    public function setFlexiselArray()
    {
        
        //var_dump($this->getData());die;
        if($this->getData('slide')){
            $options = array(
                'animationSpeed',
                'autoPlay',
                'autoPlaySpeed',
                'clone',
                'enableResponsiveBreakpoints',
                'pauseOnHover',
                'visibleItems',
            );
            $script = array();
            if($this->getData('vertical')) $script['vertical'] = true;
            if($this->getData('marginColumn')) $script['margin'] = (int) $this->getData('marginColumn');
            foreach ($options as $opt) {
                $cfg = $this->getData($opt);
                if($cfg) $script[$opt] = (int) $cfg;
            }

            if($this->getData('enableResponsiveBreakpoints'));
            {
                $responsiveBreakpoints = $this->getDevices();
                // $script['responsiveBreakpoints']['mobile'] = array('changePoint'=> 320, 'visibleItems'=> 1);
                foreach ($responsiveBreakpoints as $opt => $screen) {
                    $cfg = $this->getData($opt);
                    if($cfg) $script['responsiveBreakpoints'][$opt] = array('changePoint'=> (int) $screen, 'visibleItems'=> (int) $cfg);
                }
            }
            return $script;
        }
    }
	
    public function generateRandomString($length = 10) {
        $characters = 'abcdefghijklmnopqrstuvwxyz';
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, strlen($characters) - 1)];
        }
        return $randomString;
    }

}
