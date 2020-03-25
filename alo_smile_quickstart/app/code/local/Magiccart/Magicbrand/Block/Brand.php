<?php
/**
 * Magiccart 
 * @category  Magiccart 
 * @copyright   Copyright (c) 2014 Magiccart (http://www.magiccart.net/) 
 * @license   http://www.magiccart.net/license-agreement.html
 * @Author: DOng NGuyen<nguyen@dvn.com>
 * @@Create Date: 2014-07-28 17:49:00
 * @@Modify Date: 2015-11-10 11:01:53
 * @@Function:
 */
 ?>
<?php
class Magiccart_Magicbrand_Block_Brand extends Mage_Core_Block_Template
{
	public $config = array();

    protected function _construct()
    {
        parent::_construct();

        $this->config = Mage::helper('magicbrand')->getGeneralCfg();
    }
  
	public function getBrand()
	{
	    $store = Mage::app()->getStore()->getStoreId();
	    $attribute = isset($this->config['brand']) ? trim($this->config['brand']) : '';
	    if($attribute){
	    	$brands = Mage::getModel('magicbrand/brand')
	                    ->getCollection()
	                    ->addFieldToFilter('brand_attribute', $attribute)
	                    ->addFieldToFilter('stores',array( array('finset' => 0), array('finset' => $store)))
	                    ->addFieldToFilter('status', 1);	    	
	    } else {
	    	$brands = Mage::getModel('magicbrand/brand')
	                    ->getCollection()
						->addFieldToFilter('stores',array( array('finset' => 0), array('finset' => $store)))
	                    ->addFieldToFilter('status', 1);	    	
	    }

	    return $brands;
	}

	public function getImage($object)
	{
	    $image = Mage::helper('magicbrand/image');
	    $width = $this->config['widthImages'];
	    $height= $this->config['heightImages'];
	    $floder = $width.'x'.$height;
	    $image->setFolder($floder);
	    $image->setWidth($width);
	    $image->setHeight($height); 
	    $image->setQuality(100); // not require
	    return $image->init($object, 'image');
	}


	public function setFlexisel()
	{

	    $options = array(
	        'animationSpeed',
	        'autoPlay',
	        'autoPlaySpeed',
	        'clone',
	        'enableResponsiveBreakpoints',
	        'pauseOnHover',
	        'visibleItems',
	    );

	    $script ='';
	    foreach ($options as $opt) {
	        $cfg = $this->config[$opt];
	        if($cfg) $script .= "$opt: $cfg,";
	    }

	    if($this->config['enableResponsiveBreakpoints']);
	    {
	        $script .= 'responsiveBreakpoints: {';
	        $responsiveBreakpoints = array(
	            'portrait'  =>  '480',
	            'landscape' =>  '640',
	            'tablet'    =>  '768',
	        );

	        foreach ($responsiveBreakpoints as $opt => $screen) {
	            $cfg = $this->config[$opt];
	            if($cfg) $script .= "$opt: { changePoint: $screen, visibleItems: $cfg },";
	        }
	        $script .= "}";
	    }

	    return $script;

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

