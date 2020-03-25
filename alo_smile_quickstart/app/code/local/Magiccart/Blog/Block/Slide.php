<?php

class Magiccart_Blog_Block_Slide extends Magiccart_Blog_Block_Last
{

    protected function _prepareLayout()
    {
        if(Mage::helper('blog')->isEnabled()){
            $head = $this->getLayout()->getBlock('head');
            $head->addCss('magiccart/plugin/css/flexisel.hack.css');
            $head->addCss('magiccart/blog/css/blog.css');
            $head->addJs('magiccart/jquery.min.js');
            $head->addJs('magiccart/jquery.noconflict.js');
            $head->addJs('magiccart/plugin/jquery.flexisel.hack.js');
            $head->addJs('magiccart/magicproduct.js');        
        }
        parent::_prepareLayout();

    }

    protected function _toHtml()
    {
        $this->setTemplate('magiccart/blog/widget_slide.phtml');
        if ($this->_helper()->getEnabled()) {
            return $this->setData('blog_widget_recent_count', $this->getBlocksCount())->renderView();
        }
    }

    public function getRecent()
    {
        $collection = Mage::getModel('blog/blog')->getCollection()
            ->addPresentFilter()
            ->addEnableFilter(Magiccart_Blog_Model_Status::STATUS_ENABLED)
            ->addStoreFilter()
            ->joinComments()
            ->setOrder('created_time', 'desc')
        ;

        if ($this->getBlogCount()) {
            $collection->setPageSize($this->getBlogCount());
        } else {
            $collection->setPageSize(Mage::helper('blog')->getRecentPage());
        }

        if ($collection && $this->getData('categories')) {
            $collection->addCatsFilter($this->getData('categories'));
        }
        foreach ($collection as $item) {
            $item->setAddress($this->getBlogUrl($item->getIdentifier()));
        }
        return $collection;
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
